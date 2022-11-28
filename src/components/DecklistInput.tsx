import {
  Fragment,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncSelect from 'react-select/async';
import {Dialog, Transition} from '@headlessui/react';
import {extractType, parseList} from '../utils/decklist';
import type {CardType} from '../utils/decklist';

type Props = {
  format?: Format | undefined;
  value?: string;
  onChange?: (value: string) => void;
};

export default function DecklistInput({format, value, onChange}: Props) {
  const [open, setOpen] = useState(false);
  const importRef = useRef<HTMLTextAreaElement>(null);
  const [decklist, setDecklist] = useState<
    Array<{
      amount: number;
      name: string;
      type: CardType;
    }>
  >(() => {
    if (!value) {
      return [];
    }
    const parsed = parseList(value);

    return parsed.cards
      .filter((c) => c.validated)
      .map((c) => ({
        name: c.name,
        amount: c.amount,
        type: c.type,
      }));
  });

  const debouncedTime = useRef<NodeJS.Timeout>();

  const promiseOptions = async (
    inputValue: string
  ): Promise<Array<{label: string; value: string}>> => {
    if (inputValue.length < 3) {
      return [];
    }

    await debouncedTimer(debouncedTime, 300);

    const q = encodeURIComponent(
      (format ? 'legal:' + format : '') + ' ' + inputValue
    );

    const resp = await fetch(
      `https://api.scryfall.com/cards/search?include_multilingual=true&q=${q}`
    );
    if (resp.ok === false) {
      return [];
    }

    const {data} = await resp.json();

    return data.map((c: any) => ({
      label: c.name,
      value: c.name,
    }));
  };

  const handleAdd = (card: string, sideboard: boolean = false) => {
    setDecklist((cards) => {
      const index = cards.findIndex(
        (c) => c.name === card && (c.type === 'Sideboard') === sideboard
      );

      if (index === -1) {
        return cards.concat({
          amount: 1,
          name: card,
          type: sideboard ? 'Sideboard' : extractType(card),
        });
      }

      cards[index].amount += 1;

      return cards.concat([]);
    });
  };

  const handleDiff = (card: string, sideboard: boolean, q: number) => {
    setDecklist((cards) => {
      const index = cards.findIndex(
        (c) => c.name === card && (c.type === 'Sideboard') === sideboard
      );

      if (index === -1) {
        return cards;
      }

      cards[index].amount = q;

      if (cards[index].amount <= 0) {
        cards.splice(index, 1);
      }

      return cards.concat([]);
    });
  };

  const handleImport = () => {
    const input = importRef.current!.value;

    const parsed = parseList(input);

    setDecklist(
      parsed.cards
        .filter((c) => c.validated)
        .map((c) => ({
          name: c.name,
          amount: c.amount,
          type: c.type,
        }))
    );

    importRef.current!.value = '';
    setOpen(false);
  };

  const maindeckCount = decklist
    .filter((c) => c.type !== 'Sideboard')
    .reduce((a, c) => a + c.amount, 0);

  const sideboardCount = decklist
    .filter((c) => c.type === 'Sideboard')
    .reduce((a, c) => a + c.amount, 0);

  useEffect(() => {
    if (!value) {
      return;
    }

    const parsed = parseList(value);

    setDecklist(
      parsed.cards
        // .filter((c) => c.validated)
        .map((c) => ({
          name: c.name,
          amount: c.amount,
          type: c.type,
        }))
    );
  }, [value]);

  useEffect(() => {
    if (onChange === undefined) {
      return;
    }

    const main = decklist
      .filter((c) => c.type !== 'Sideboard')
      .map((c) => `${c.amount} ${c.name}`);

    const side = decklist
      .filter((c) => c.type === 'Sideboard')
      .map((c) => `${c.amount} ${c.name}`);

    onChange(main.concat('\n').concat(side).join('\n'));
  }, [onChange, decklist]);

  return (
    <>
      <span className="block font-bold text-2xl mt-6">Decklist </span>
      <p>
        <button
          className="underline"
          type="button"
          onClick={() => setOpen(true)}
        >
          Click here
        </button>{' '}
        to import a decklist
      </p>
      <div className="md:grid grid-cols-2 gap-20">
        <div>
          <span className="block font-bold text-lg mt-6">
            Maindeck ({maindeckCount})
          </span>
          <div className="w-full">
            <div className="flex flex-row">
              <AsyncSelect
                placeholder="Type a card to add"
                cacheOptions
                defaultOptions
                value={null}
                loadOptions={promiseOptions}
                className="flex-1"
                onChange={(opt) => opt && handleAdd(opt.value)}
              />
            </div>
          </div>

          <div className="columns-2">
            {[
              'Planeswalker',
              'Creature',
              'Instant',
              'Sorcery',
              'Artifact',
              'Enchantment',
              'Land',
              'Other',
            ].map((type) => {
              if (decklist.some((c) => c.type === type) === false) {
                return null;
              }

              return (
                <div key={type} className="break-inside-avoid-column">
                  <h3 className="font-bold text-lg mt-2">
                    {type === 'Other' ? (
                      <abbr title="Not recognized cards, not a problem">
                        Other
                      </abbr>
                    ) : (
                      type
                    )}
                  </h3>
                  <ul>
                    {decklist
                      .filter((c) => c.type === type)
                      .map((card, index) => (
                        <li key={index} className="flex items-center">
                          <button
                            type="button"
                            className="px-2 py-1"
                            onClick={() =>
                              handleDiff(card.name, false, card.amount + 1)
                            }
                          >
                            +
                          </button>
                          <span className="inline-block w-4 text-center">
                            {card.amount}
                          </span>
                          <button
                            type="button"
                            className="px-2 py-1"
                            onClick={() =>
                              handleDiff(card.name, false, card.amount - 1)
                            }
                          >
                            -
                          </button>{' '}
                          <span className="truncate">{card.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <span className="block font-bold text-lg mt-6">
            Sideboard ({sideboardCount})
          </span>
          <div className="w-full">
            <div className="flex flex-row">
              <AsyncSelect
                placeholder="Type a card to add"
                cacheOptions
                defaultOptions
                value={null}
                loadOptions={promiseOptions}
                className="flex-1"
                onChange={(opt) => opt && handleAdd(opt.value, true)}
              />
            </div>
          </div>

          <div className="columns-2">
            {['Sideboard'].map((type) => {
              if (decklist.some((c) => c.type === type) === false) {
                return null;
              }

              return (
                <div key={type} className="break-inside-avoid-column">
                  <h3 className="font-bold text-lg mt-2">
                    {type === 'Other' ? (
                      <abbr title="Not recognized cards, not a problem">
                        Other
                      </abbr>
                    ) : (
                      type
                    )}
                  </h3>
                  <ul>
                    {decklist
                      .filter((c) => c.type === type)
                      .map((card, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            className="px-2 py-1"
                            onClick={() =>
                              handleDiff(card.name, true, card.amount + 1)
                            }
                          >
                            +
                          </button>
                          <span className="inline-block w-4 text-center">
                            {card.amount}
                          </span>
                          <button
                            type="button"
                            className="px-2 py-1"
                            onClick={() =>
                              handleDiff(card.name, true, card.amount - 1)
                            }
                          >
                            -
                          </button>{' '}
                          {card.name}
                        </li>
                      ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <span className="block font-bold text-2xl mt-6">
                      Import decklist
                    </span>

                    <p>Use english cards</p>

                    <div className="w-full">
                      <textarea
                        ref={importRef}
                        className="w-full min-h-[240px]"
                        placeholder={
                          '4 Goblin Guide\n4 Lava Spike\n\n2 Deflecting Palm'
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="button"
                      onClick={handleImport}
                    >
                      Import
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

const debouncedTimer = async (
  debouncedTime: MutableRefObject<NodeJS.Timeout | undefined>,
  ms: number
) => {
  return new Promise<void>((r, f) => {
    const timer = setTimeout(() => {
      if (debouncedTime.current !== timer) {
        f();
        return;
      }

      debouncedTime.current = undefined;
      r();
    }, ms);

    debouncedTime.current = timer;
  });
};
