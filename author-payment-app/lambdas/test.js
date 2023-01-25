let booksMap = new Map();
const PRIMARY_KEY = "postHashHex";
const SORT_KEY = "serial";
const books = {
    "Items": [
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "1"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "10"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "2"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "3"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "4"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "5"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "6"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "7"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "8"
      },
      {
        "postHashHex": "e2149e065904a2e0e5a62a5d5aa10900d9688c3554358c3dbee6d0b70ccf7a3c",
        "serial": "9"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "0"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "10"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "11"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "12"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "13"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "14"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "15"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "16"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "17"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "18"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "19"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "2"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "20"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "21"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "22"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "23"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "24"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "25"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "26"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "27"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "28"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "29"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "3"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "30"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "31"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "32"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "33"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "34"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "35"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "36"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "37"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "38"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "39"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "4"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "40"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "41"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "42"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "43"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "44"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "5"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "6"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "7"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "8"
      },
      {
        "postHashHex": "cb5328d84b36063a8bd02a0b7d6e9b0e51c69372514657783ff199865fb2d9ce",
        "serial": "9"
      }
    ],
    "Count": 54,
    "ScannedCount": 54
  };

books["Items"].forEach(book => {
    if (!booksMap.has(book[PRIMARY_KEY])) {
      booksMap.set(book[PRIMARY_KEY], new Array());
    }
    booksMap.get(book[PRIMARY_KEY]).push(book[SORT_KEY]);
  });

for (let key of booksMap.keys()) {
    console.log(key);
    console.log(booksMap.get(key));
}