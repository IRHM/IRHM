import * as fs from "fs";
import axios from "./node_modules/axios/index.js";

interface stat {
  person: string;
  data: {
    chess_bullet: chess_bullet;
    chess_blitz: chess_blitz;
    chess_rapid: chess_rapid;
  };
}

interface chess_bullet {
  last: last;
  best: best;
  record: record;
}

interface chess_blitz {
  last: last;
  best: best;
  record: record;
}

interface chess_rapid {
  last: last;
  best: best;
  record: record;
}

interface last {
  rating: number;
}

interface best {
  rating: number;
  game: string;
}

interface record {
  win: number;
  loss: number;
  draw: number;
}

class GetStats {
  async requestStats() {
    // if (
    //   process.env.URL_STAT_ME == undefined ||
    //   process.env.URL_STAT_MR == undefined ||
    //   process.env.URL_STAT_KINGO == undefined ||
    //   process.env.URL_STAT_DAN == undefined ||
    //   process.env.URL_STAT_MAR == undefined
    // ) {
    //   throw new Error("Some or all of the URL_STAT_... env vars are missing.");
    // }

    // const statsMe = await axios.get(process.env.URL_STAT_ME);
    // const statsMr = await axios.get(process.env.URL_STAT_MR);
    // const statsKingo = await axios.get(process.env.URL_STAT_KINGO);
    // const statsDan = await axios.get(process.env.URL_STAT_DAN);
    // const statsMar = await axios.get(process.env.URL_STAT_MAR);

    const statsMe = await axios.get("https://api.chess.com/pub/player/sbondo1234/stats");
    const statsMr = await axios.get("https://api.chess.com/pub/player/mrunknownman/stats");
    const statsKingo = await axios.get("https://api.chess.com/pub/player/kingo2157/stats");
    const statsDan = await axios.get("https://api.chess.com/pub/player/dan_richman/stats");
    const statsMar = await axios.get("https://api.chess.com/pub/player/mizsoonhome/stats");

    var t: stat[] = [
      { person: "Me", data: statsMe.data },
      { person: "Mr 2 Gut", data: statsMr.data },
      { person: "Kingo", data: statsKingo.data },
      { person: "Dan", data: statsDan.data },
      { person: "Marius", data: statsMar.data }
    ];

    return t;
  }
}

let getStats = new GetStats();

// Write README
getStats.requestStats().then((stats) => {
  let toWrite = `
${process.env.BASE_README}

### I am the best at chess

<table>
<tr>
  <td rowspan="1"></td>
  <th colspan="3" scope="colgroup">Game</th>
  <th colspan="3" scope="colgroup">Latest Rating</th>
  <th colspan="3" scope="colgroup">Best Rating</th>
</tr>
<tr>
  <th>Person</th>
  <th>Wins</th>
  <th>Losses</th>
  <th>Draws</th>
  <th>Bullet</th>
  <th>Blitz</th>
  <th>Rapid</th>
  <th>Bullet</th>
  <th>Blitz</th>
  <th>Rapid</th>
</tr>
  `;

  stats.forEach(function (s) {
    let wins = s.data.chess_bullet.record.win + s.data.chess_blitz.record.win + s.data.chess_rapid.record.win;
    let losses = s.data.chess_bullet.record.loss + s.data.chess_blitz.record.loss + s.data.chess_rapid.record.loss;
    let draws = s.data.chess_bullet.record.draw + s.data.chess_blitz.record.draw + s.data.chess_rapid.record.draw;

    toWrite = toWrite.concat(`
<tr>
  <td>${s.person}</td>
  <td>${wins}</td>
  <td>${losses}</td>
  <td>${draws}</td>
  <td>${s.data.chess_bullet.last.rating}</td>
  <td>${s.data.chess_blitz.last.rating}</td>
  <td>${s.data.chess_rapid.last.rating}</td>
  <td>${s.data.chess_bullet.best.rating}</td>
  <td>${s.data.chess_blitz.best.rating}</td>
  <td>${s.data.chess_rapid.best.rating}</td>
</tr>
    \n`);
  });

  toWrite = toWrite.concat(`</table>`);

  fs.writeFile("README.md", toWrite, (err) => {
    if (err) console.log("Couldn't write to README");
    else console.log("Wrote to README");
  });
});
