import * as fs from 'fs';
import axios from './node_modules/axios/index.js';

interface stat {
  person: string,
  chess_blitz: chess_blitz
}

interface chess_blitz {
  last: last,
  best: best,
  record: record
}

interface last {
  rating: number
}

interface best {
  rating: number,
  game: string
}

interface record {
  win: number,
  loss: number,
  draw: number
}

class GetStats {
  async requestStats() {
    const statsMe = await axios.get(process.env.URL_STAT_ME);
    const statsMr = await axios.get(process.env.URL_STAT_MR);
    const statsKingo = await axios.get(process.env.URL_STAT_KINGO);
    const statsDan = await axios.get(process.env.URL_STAT_DAN);
    const statsMar = await axios.get(process.env.URL_STAT_MAR);

    var t: stat[] = [
      { person: "Me", chess_blitz: statsMe.data.chess_blitz },
      { person: "Mr 2 Gut", chess_blitz: statsMr.data.chess_blitz },
      { person: "Kingo", chess_blitz: statsKingo.data.chess_blitz },
      { person: "Dan", chess_blitz: statsDan.data.chess_blitz },
      { person: "Marius", chess_blitz: statsMar.data.chess_blitz }
    ];

    return t;
  }
}

let getStats = new GetStats();

// Write README
getStats.requestStats().then(stats => {
  let toWrite = `
${process.env.BASE_README}

### I am the best at chess

<table>
<tr>
  <td rowspan="1"></td>
  <th colspan="3" scope="colgroup">Game</th>
  <th colspan="1" scope="colgroup">Latest</th>
  <th colspan="1" scope="colgroup">Best</th>
</tr>
<tr>
  <th>Person</th>
  <th>Wins</th>
  <th>Losses</th>
  <th>Draws</th>
  <th>Rating</th>
  <th>Rating</th>
</tr>
  `;

  stats.forEach(function(s) {
    toWrite = toWrite.concat(`
<tr>
  <td>${s.person}</td>
  <td>${s.chess_blitz.record.win}</td>
  <td>${s.chess_blitz.record.loss}</td>
  <td>${s.chess_blitz.record.draw}</td>
  <td>${s.chess_blitz.last.rating}</td>
  <td>${s.chess_blitz.best.rating}</td>
</tr>
    \n`);
  });

  toWrite = toWrite.concat(`</table>`);
  
  fs.writeFile('README.md', toWrite, (err) => {
    if (err) console.log("Couldn't write to README");
    else console.log("Wrote to README");
  });
});
