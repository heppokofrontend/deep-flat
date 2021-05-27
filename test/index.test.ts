import { flatDeep } from '../src/index';


test('Basic usege', () => {
  const arr = [
    [
      0,
      [
        1,
        2,
      ],
      3,
      [
        4,
        5,
        6,
        [
          [
            7,
          ],
          8,
        ],
      ],
      9,
      [
        10
      ],
    ]
  ];

  expect(flatDeep<number>(arr).reduce((a, b) => a + b)).toBe(55);
  expect(flatDeep(arr).length).toBe(11);
});

test('Ignore string', () => {
  const arr = [
    'hoge',
    [
      'string',
    ],
  ];

  expect(flatDeep<string>(arr)[1]).toBe('string');
});

test('flat a string', () => {
  const arr = [
    'hoge',
    [
      'string',
    ],
  ];

  expect(flatDeep<string>(arr, {stringIgnore: false})[4]).toBe('s');
});

test('flat any[]', () => {
  const map = new Map();
  const arr = [
    'hoge',
    [
      [
        map,
        2,
      ],
      'string',
      [
        0,
        2,
        3,
        4,
        5,
      ],
    ],
  ];

  map.set({}, true);

  expect(flatDeep(arr, {stringIgnore: false})[5]).toBe(true);
});

test('Infinity loop test', () => {
  const arr: any[] = [
    0,
    1,
    2,
  ];
  const map = new Map();
  const iterator = (() => {
    const gen = function *() {
      yield* arr;
    };

    return gen();
  })();

  map.set(arr, arr);

  arr.push(map);
  arr.push(arr);
  arr.push(iterator);
  arr.push(new Set([arr]));

  const flattened = flatDeep(arr);
  const flattened2 = flatDeep(arr, {circularReferenceToJson: true});


  expect(flattened[3]).toBe(0);
  expect(flattened[6]).toBe(map);

  expect(flattened2[3]).toBe(0);
  // 循環参照を見つけたらJSONに変換する
  expect(typeof flattened[6] === 'object').toBe(true);
  expect(Object.keys(flattened[6]).length).toBe(0);
  expect(flattened2[7]).toBe('[Circular]');
});

test('Infinity loop test', () => {
  const map = new Map();
  const arr = [
    'hoge',
    [
      map,
    ],
    1000,
  ];
  const a = [0, 1, 2, arr, 4];

  map.set(a, a);

  const flattened = flatDeep(arr);

  expect(flattened[1]).toBe(0);
  expect(flattened[4]).toBe('hoge');
  expect(flattened[5]).toBe(arr[1]); // 循環参照を無視
});

test('Infinity loop test with to JSON', () => {
  const map = new Map();
  const arr = [
    'hoge',
    [
      map,
    ],
    1000,
  ];
  const a = [0, 1, 2, arr, 4];

  map.set(a, arr);

  const flattened = flatDeep(arr, {circularReferenceToJson: true});

  expect(flattened[1]).toBe(0);
  expect(flattened[4]).toBe('hoge');
  // 循環参照を見つけたらJSONに変換する
  expect(typeof flattened[5] === 'object').toBe(true);
  expect(Object.keys(flattened[5]).length).toBe(0);
});

test('Infinity loop test with string ignore', () => {
  const map = new Map();
  const arr = [
    'hoge',
    [
      map,
    ],
    1000,
  ];
  const a = [0, 1, 2, arr, 4];

  map.set(a, a);

  const flattened = flatDeep(arr, {stringIgnore: false});

  expect(flattened[1]).toBe('o');
  expect(flattened[4]).toBe(0);
  // 循環参照を無視
  expect(flattened[8]).toBe(arr[1]);
});

test('Infinity loop test with to JSON and string ignore', () => {
  const map = new Map();
  const arr = [
    'hoge',
    [
      map,
    ],
    1000,
  ];
  const a = [0, 1, 2, arr, 4];

  map.set(a, arr);

  const flattened = flatDeep(arr, {
    stringIgnore: false,
    circularReferenceToJson: true,
  });

  expect(flattened[1]).toBe('o');
  expect(flattened[4]).toBe(0);
  expect(flattened[6]).toBe(2);
  // 循環参照を見つけたらJSONに変換する
  expect(flattened[7]).toBe('h');
  // map -> {}
  expect(typeof flattened[11] === 'object').toBe(true);
  expect(Object.keys(flattened[11]).length).toBe(0);
});
