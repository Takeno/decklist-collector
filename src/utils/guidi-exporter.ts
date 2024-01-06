import JSZip from 'jszip';
import {saveAs} from 'file-saver';

export async function generateAndDownloadDecklists(
  data: TournamentPlayerDecklistSubmitted[]
): Promise<void> {
  const zip = new JSZip();

  data.forEach((item) => {
    zip.file(
      `${item.deck_archetype} - ${item.last_name} ${item.first_name}.txt`,
      item.decklist.replaceAll('\n', '\r\n')
    );
  });

  zip.generateAsync({type: 'blob'}).then((blob) => {
    saveAs(blob, 'decklist.zip');
  });
}
