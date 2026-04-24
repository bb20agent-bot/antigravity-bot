const fetch = require('node-fetch');

async function test() {
    const res = await fetch('https://toncenter.com/api/v3/jetton/transfers?jetton_master=EQALn486GGrxx6AQCdkbmJA5F6aLTePRCoHyPdUZAgjOaqF4&limit=12&offset=0');
    console.log(res.status);
    console.log(await res.text());
}
test();
