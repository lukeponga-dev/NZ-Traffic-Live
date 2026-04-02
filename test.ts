async function test() {
  const res = await fetch('https://trafficnz.info/service/traffic/rest/4/cameras/all?format=json', {
    headers: { 'Accept': 'application/json' }
  });
  const data = await res.json();
  console.log(JSON.stringify(data.response.camera[0], null, 2));
}
test();
