const orders = [
  'Bologna',
  'Fuguete',
  'Gramuglia',
  'Kauf',
  'Ke',
  'Lecchi',
  'Maggi',
  'Micheli',
  'Perks',
  'Severin',
  'Tocchi',
  'Mattera',
  'Bragioto',
  'Francini',
  'Grazzini ',
  '25816',
  '25817',
  '25818',
  '25819',
  '25820',
  '25821',
  '25822',
  '25823',
  '25824',
  '25825',
  '25826',
  '25827',
  '25828',
  '25829',
  '25830',
  '25831',
  '25832',
  '25833',
  '25834',
  '25835',
  '25836',
  '25837',
  '25838',
  '25839',
  '25840',
  '25841',
  '25842',
  '25843',
  '25844',
  '25845',
  '25846',
  '25847',
  '25848',
  '25849',
  '25850',
  '25851',
  '25852',
  '25853',
  '25854',
  '25855',
  '25856',
  '25857',
  '25858',
  '25859',
  '25860',
  '25861',
  '25862',
  '25863',
  '25864',
  '25865',
  '25866',
  '25867',
  '25868',
  '25869',
  '25870',
  '25871',
  '25872',
  '25873',
  '25874',
  '25875',
  '25876',
  '25878',
  '25879',
  '25880',
  '25881',
  '25882',
  '25883',
  '25884',
  '25885',
  '25886',
  '25887',
  '25888',
  '25889',
  '25891',
  '25893',
  '25894',
  '25895',
  '25896',
  '25897',
  '25898',
  '25899',
  '25900',
  '25901',
  '25902',
  '25903',
  '25904',
  '25905',
  '25906',
  '25907',
  '25908',
  '25909',
  '25910',
  '25911',
  '25912',
  '25913',
  '25914',
  '25915',
  '25916',
  '25917',
  '25918',
  '25919',
  '25920',
  '25921',
  '25922',
  '25923',
  '25924',
  '25925',
  '25926',
  '25927',
  '25928',
  '25929',
  '25930',
  '25931',
  '25932',
  '25933',
  '25934',
  '25936',
  '25937',
  '25938',
  '25939',
  '25940',
  '25941',
  '25942',
  '25943',
  '25944',
  '25945',
  '25946',
  '25947',
  '25948',
  '25949',
  '25950',
  '25951',
  '25952',
  '25953',
  '25954',
  '25955',
  '25956',
  '25957',
  '25958',
  '25959',
  '25960',
  '25961',
  '25962',
  '25963',
  '25964',
  '25965',
  '25966',
  '25967',
  '25968',
  '25969',
  '25970',
  '25971',
  '25972',
  '25973',
  '25974',
  '25975',
  '25976',
  '25977',
  '25978',
  '25979',
  '25980',
  '25981',
  '25982',
  '25983',
  '25984',
  '25985',
  '25986',
  '25987',
  '25988',
  '25989',
  '25990',
  '25991',
  '25992',
  '25993',
  '25994',
  '25995',
  '25996',
  '25997',
  '25998',
  '25999',
  '26000',
  '26001',
  '26002',
  '26003',
  '26004',
  '26005',
  '26006',
  '26007',
  '26008',
  '26009',
  '26010',
  '26011',
  '26012',
  '26013',
  '26014',
  '26015',
  '26016',
  '26017',
  '26018',
  '26019',
  '26020',
  '26021',
  '26022',
  '26023',
  '26024',
  '26025',
  '26026',
  '26027',
  '26028',
  '26029',
  '26030',
  '26031',
  '26033',
  '26034',
  '26035',
  '26036',
  '26038',
  '26039',
  '26040',
  '26041',
  '26043',
  '26044',
  '26045',
  '26046',
  '26047',
  '26048',
  '26049',
  '26050',
  '26051',
  '26052',
  '26053',
  '26054',
  '26055',
  '26056',
  '26057',
  '26058',
  '26059',
  '26061',
  '26062',
  '26063',
  '26064',
  '26065',
  '26066',
  '26067',
  '26068',
  '26069',
  '26070',
  '26071',
  '26072',
  '26073',
  '26074',
  '26075',
  '26076',
  '26077',
  '26078',
  '26079',
  '26080',
  '26081',
  '26082',
  '26083',
  '26084',
  '26085',
  '26086',
  '26087',
  '26088',
  '26089',
  '26090',
  '26091',
  '26092',
  '26093',
  '26094',
  '26095',
  '26096',
  '26097',
  '26099',
  '26100',
  '26101',
  '26102',
  '26103',
  '26104',
  '26105',
  '26106',
  '26107',
  '26108',
  '26109',
  '26110',
  '26111',
  '26112',
  '26113',
  '26114',
  '26115',
  '26116',
  '26117',
  '26118',
  '26119',
  '26120',
  '26121',
  '26122',
  '26127',
  '26128',
  '26129',
  '26130',
  '26131',
  '26132',
  '26133',
  '26134',
  '26135',
  '26136',
  '26137',
  '26138',
  '26139',
  '26140',
  '26141',
  '26142',
  '26143',
  '26144',
  '26145',
  '26146',
  '26147',
  '26148',
  '26149',
  '26150',
  '26151',
  '26152',
  '26153',
  '26154',
  '26155',
  '26156',
  '26157',
  '26158',
  '26159',
  '26160',
  '26164',
  '26165',
  '26166',
  '26167',
  '26168',
  '26169',
  '26170',
  '26171',
  '26172',
  '26173',
  '26174',
  '26175',
  '26176',
  '26177',
  '26178',
  '26179',
  '26180',
  '26181',
  '26183',
  '26184',
  '26185',
  '26186',
  '26187',
  '26188',
  '26189',
  '26190',
  '26191',
  '26192',
  '26193',
  '26194',
  '26195',
  '26196',
  '26197',
  '26198',
  '26199',
  '26200',
  '26201',
  '26202',
  '26203',
  '26204',
  '26205',
  '26206',
  '26207',
  '26208',
  '26209',
  '26210',
  '26211',
  '26216',
  '26217',
  '26218',
  '26219',
  '26220',
  '26221',
  '26222',
  '26223',
  '26224',
  '26225',
  '26226',
  '26227',
  '26228',
  '26229',
  '26230',
  '26231',
  '26232',
  '26233',
  '26234',
  '26235',
  '26236',
  '26237',
  '26238',
  '26239',
  '26240',
  '26241',
  '26242',
  '26243',
  '26244',
  '26245',
  '26246',
  '26247',
  '26248',
  '26249',
  '26250',
  '26251',
  '26252',
  '26253',
  '26254',
  '26255',
  '26256',
  '26257',
  '26258',
  '26259',
  '26260',
  '26261',
  '26262',
  '26263',
  '26264',
  '26265',
  '26266',
  '26267',
  '26268',
  '26269',
  '26270',
  '26271',
  '26272',
  '26273',
  '26274',
  '26275',
  '26276',
  '26277',
  '26278',
  '26279',
  '26280',
  '26281',
  '26282',
  '26283',
  '26284',
  '26285',
  '26286',
  '26287',
  '26288',
  '26289',
  '26290',
  '26291',
  '26292',
  '26295',
  '26296',
  '26297',
  '26298',
  '26299',
  '26300',
  '26301',
  '26310',
  '26311',
  '26312',
  '26313',
  '26314',
  '26315',
  '26319',
  '26320',
  '26321',
  '26322',
  '26323',
  '26324',
  '26325',
  '26326',
  '26328',
  '26329',
  '26330',
  '26331',
  '26332',
  '26333',
  '26334',
  '26335',
  '26336',
  '26337',
  '26339',
  '26340',
  '26342',
  '26343',
  '26345',
  '26346',
  '26347',
  '26348',
  '26349',
  '26350',
  '26351',
  '26356',
  '26357',
  '26358',
  '26361',
  '26362',
  '26363',
  '26367',
  '26368',
  '26369',
  '26370',
  '26371',
  '26372',
  '26373',
  '26374',
  '26375',
  '26377',
  '26378',
  '26379',
  '26380',
  '26381',
  '26382',
  '26384',
  '26385',
  '26386',
  '26387',
  '26388',
  '26389',
  '26390',
  '26391',
  '26392',
  '26393',
  '26394',
  '26395',
  '26396',
  '26397',
  '26398',
  '26399',
  '26400',
  '26401',
  '26402',
  '26403',
  '26404',
  '26405',
  '26406',
  '26408',
  '26409',
  '26410',
  '26411',
  '26412',
  '26413',
  '26414',
  '26415',
  '26416',
  '26417',
  '26418',
  '26419',
  '26420',
  '26421',
  '26422',
  '26423',
  '26424',
  '26425',
  '26426',
  '26427',
  '26428',
  '26429',
  '26430',
  '26431',
  '26432',
  '26433',
  '26434',
  '26435',
  '26436',
  '26437',
  '26438',
  '26439',
  '26440',
  '26441',
  '26442',
  '26443',
  '26444',
  '26445',
  '26446',
  '26447',
  '26448',
  '26449',
  '26450',
  '26451',
  '26452',
  '26453',
  '26454',
  '26455',
  '26456',
  '26457',
  '26458',
  '26459',
  '26460',
  '26461',
  '26462',
  '26463',
  '26464',
  '26465',
  '26466',
  '26467',
  '26468',
  '26469',
  '26470',
  '26471',
  '26472',
  '26473',
  '26474',
  '26476',
  '26477',
  '26478',
  '26479',
  '26480',
  '26481',
  '26482',
  '26483',
  '26484',
  '26485',
  '26486',
  '26487',
  '26488',
  '26489',
  '26490',
  '26491',
  '26492',
  '26493',
  '26494',
  '26495',
  '26496',
  '26497',
  '26499',
  '26500',
  '26501',
  '26502',
  '26503',
  '26504',
  '26505',
  '26506',
  '26507',
  '26508',
  '26509',
  '26510',
  '26511',
  '26512',
  '26513',
  '26514',
  '26517',
  '26520',
  '26522',
  '26523',
  '26524',
  '26525',
  '26526',
  '26527',
  '26528',
  '26529',
  '26530',
  '26531',
  '26532',
  '26533',
  '26534',
  '26535',
  '26536',
  '26537',
  '26538',
  '26539',
  '26540',
  '26541',
  '26542',
  '26543',
  '26544',
  '26546',
  '26559',
  '26571',
  '26577',
  '26578',
  '26581',
  '26583',
];

export function isPreorder(number: string | undefined) {
  if (number === undefined) {
    return false;
  }
  return orders.includes(number.trim());
}
