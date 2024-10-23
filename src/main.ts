/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!('usb' in navigator)) {
  console.log('WebUSB API is not supported')
}

let button = document.getElementById('request-device')
button?.addEventListener('click', async () => {
  try {
    const device = await navigator.usb.requestDevice({ filters: [] });
    const elem = document.querySelector('#dosomething');
    elem.textContent = `Do something with '${device.productName}'`;
    elem.onclick = () => testPrint(device);
    console.log(device)
  } catch (e) {
    console.error(e);
  }
})

async function testPrint(device) {
  const cmds = [
    'SIZE 48 mm,25 mm',
    'CLS',
    'TEXT 30,10,"4",0,1,1,"Test"',
    'TEXT 30,50,"2",0,1,1,"WebUSB API"',
    'BARCODE 30,80,"128",70,1,0,2,2,"altospos.com"',
    'PRINT 1',
    'END',
  ];
  
  await device.open();
  await device.selectConfiguration(1);
  await device.claimInterface(0);
  await device.transferOut(
    device.configuration.interfaces[0].alternate.endpoints.find(obj => obj.direction === 'out').endpointNumber,
    new Uint8Array(
      new TextEncoder().encode(cmds.join('\r\n'))
    ),
  );
  await device.close();
}

document.addEventListener('DOMContentLoaded', async () => {
  let devices = await navigator.usb.getDevices()
  console.log(devices)
})