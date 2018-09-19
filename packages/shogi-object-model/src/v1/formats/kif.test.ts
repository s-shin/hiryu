import * as kif from "./kif";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import Encoding from "encoding-japanese";

const sample = `開始日時：2018/05/02 17:59:49
棋戦：将棋ウォーズ(10切)
持ち時間：10分切れ負け
手合割：平手
先手：taro
後手：jiro
手数----指手---------消費時間--
1 ７六歩(77)   ( 00:01/00:00:01)
2 ３四歩(33)   ( 00:01/00:00:01)
3 ２六歩(27)   ( 00:02/00:00:03)
4 ８四歩(83)   ( 00:00/00:00:01)
5 ２五歩(26)   ( 00:01/00:00:04)
6 ８五歩(84)   ( 00:02/00:00:03)
7 ７八金(69)   ( 00:02/00:00:06)
8 ３二金(41)   ( 00:01/00:00:04)
9 ２四歩(25)   ( 00:01/00:00:07)
10 同　歩(23)   ( 00:01/00:00:05)
11 同　飛(28)   ( 00:01/00:00:08)
12 ８六歩(85)   ( 00:01/00:00:06)
13 同　歩(87)   ( 00:02/00:00:10)
14 同　飛(82)   ( 00:01/00:00:07)
15 ３四飛(24)   ( 00:06/00:00:16)
16 ３三角(22)   ( 00:02/00:00:09)
17 同　飛成(34)   ( 00:03/00:00:19)
18 同　桂(21)   ( 00:06/00:00:15)
19 ７七角打   ( 00:02/00:00:21)
20 ８八飛成(86)   ( 00:06/00:00:21)
21 同　角(77)   ( 00:02/00:00:23)
22 ２四飛打   ( 01:12/00:01:33)
23 ２八歩打   ( 00:58/00:01:21)
24 ２七歩打   ( 01:08/00:02:41)
25 同　歩(28)   ( 00:01/00:01:22)
26 同　飛成(24)   ( 00:03/00:02:44)
27 ２八飛打   ( 00:02/00:01:24)
28 同　龍(27)   ( 00:06/00:02:50)
29 同　銀(39)   ( 00:01/00:01:25)
30 ２七歩打   ( 00:07/00:02:57)
31 同　銀(28)   ( 00:58/00:02:23)
32 ２八歩打   ( 00:16/00:03:13)
33 ２一飛打   ( 00:07/00:02:30)
34 ４五桂(33)   ( 00:34/00:03:47)
35 ６八金(78)   ( 00:13/00:02:43)
36 ２九歩成(28)   ( 00:04/00:03:51)
37 １一角成(88)   ( 00:14/00:02:57)
38 ３七桂(45)   ( 01:25/00:05:16)
39 ４八金(49)   ( 00:41/00:03:38)
40 ３九と(29)   ( 00:11/00:05:27)
41 ８八馬(11)   ( 01:12/00:04:50)
42 ２九飛打   ( 00:23/00:05:50)
43 ６九玉(59)   ( 00:58/00:05:48)
44 ８六桂打   ( 00:06/00:05:56)
45 ３八銀(27)   ( 01:53/00:07:41)
46 ２一飛成(29)   ( 00:15/00:06:11)
47 ３七銀(38)   ( 00:01/00:07:42)
48 ２九龍(21)   ( 00:04/00:06:15)
49 ５九香打   ( 00:03/00:07:45)
50 ３八と(39)   ( 00:29/00:06:44)
51 ８七歩打   ( 00:05/00:07:50)
52 ３九飛打   ( 00:16/00:07:00)
53 ５八金(48)   ( 00:09/00:07:59)
54 ３七と(38)   ( 00:07/00:07:07)
55 ８六歩(87)   ( 00:02/00:08:01)
56 ４七と(37)   ( 00:07/00:07:14)
57 ７七馬(88)   ( 00:11/00:08:12)
58 ５八と(47)   ( 00:08/00:07:22)
59 同　金(68)   ( 00:01/00:08:13)
60 ８八歩打   ( 00:38/00:08:00)
61 同　銀(79)   ( 00:02/00:08:15)
62 ３八飛成(39)   ( 00:06/00:08:06)
63 ３三歩打   ( 00:04/00:08:19)
64 ４二金(32)   ( 00:04/00:08:10)
65 ２二歩打   ( 00:08/00:08:27)
66 １四角打   ( 00:27/00:08:37)
67 ７八玉(69)   ( 00:20/00:08:47)
68 ４七銀打   ( 00:26/00:09:03)
69 ８七玉(78)   ( 00:07/00:08:54)
70 ５八銀成(47)   ( 00:04/00:09:07)
71 同　香(59)   ( 00:02/00:08:56)
72 同　角成(14)   ( 00:02/00:09:09)
73 ２一歩成(22)   ( 00:01/00:08:57)
74 同　龍(29)   ( 00:02/00:09:11)
75 ３二銀打   ( 00:05/00:09:02)
76 同　銀(31)   ( 00:02/00:09:13)
77 同　歩成(33)   ( 00:02/00:09:04)
78 同　龍(21)   ( 00:01/00:09:14)
79 ３三歩打   ( 00:06/00:09:10)
80 ２三龍(32)   ( 00:03/00:09:17)
81 ３二銀打   ( 00:03/00:09:13)
82 ２五龍(23)   ( 00:01/00:09:18)
83 ５五桂打   ( 00:03/00:09:16)
84 ５二銀打   ( 00:03/00:09:21)
85 ３一銀(32)   ( 00:09/00:09:25)
86 ４一金(42)   ( 00:04/00:09:25)
87 ４五桂打   ( 00:17/00:09:42)
88 ３一金(41)   ( 00:03/00:09:28)
89 ５三桂成(45)   ( 00:03/00:09:45)
90 同　銀(52)   ( 00:04/00:09:32)
91 ６三桂(55)   ( 00:01/00:09:46)
92 ６二玉(51)   ( 00:03/00:09:35)
93 ７一桂成(63)   ( 00:02/00:09:48)
94 同　金(61)   ( 00:02/00:09:37)
95 ３二歩成(33)   ( 00:02/00:09:50)
96 同　金(31)   ( 00:02/00:09:39)
97 ７八銀打   ( 00:02/00:09:52)
98 ６八馬(58)   ( 00:03/00:09:42)
99 同　馬(77)   ( 00:01/00:09:53)
100 同　龍(38)   ( 00:01/00:09:43)
101 ４一角打   ( 00:02/00:09:55)
102 ９五桂打   ( 00:02/00:09:45)
103 ９八玉(87)   ( 00:01/00:09:56)
104 ７八龍(68)   ( 00:01/00:09:46)
105 ３二角成(41)   ( 00:03/00:09:59)
106 ８七桂成(95)   ( 00:02/00:09:48)
107 投了`;

describe("kif", () => {
  test("parseRecord", () => {
    const r = kif.parseRecord(sample);
    expect(r).not.toBeInstanceOf(Error);
    // fs.writeFileSync("a.json", JSON.stringify(r, undefined, 2));
  });

  test("detectEncoding and parse", () => {
    const data = fs.readFileSync(
      path.resolve(__dirname, "__test__/sample_swks_sakura_ne_jp_wars_kifsearch.kif"),
    );
    const encoding = kif.detectEncoding(data);
    let text: string;
    try {
      // Exception will be thrown if node isn't built with --with-intl=full-icu.
      // cf. https://nodejs.org/api/intl.html
      const decoder = new util.TextDecoder(encoding);
      text = decoder.decode(data);
    } catch (e) {
      text = Encoding.convert(data, {
        from: encoding.toUpperCase(),
        to: "UNICODE",
        type: "string",
      });
    }
    // fs.writeFileSync("a.kif", text);
    // const fd = fs.openSync("a.log", "w");
    // const r = kif.parseRecord(text, msg => fs.writeSync(fd, `${msg}\n`));
    const r = kif.parseRecord(text);
    expect(r).not.toBeInstanceOf(Error);
    // fs.writeFileSync("a.json", JSON.stringify(r, undefined, 2));
  });
});