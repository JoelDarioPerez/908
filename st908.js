function hexToBinary(hex) {
  return BigInt(hex).toString(2);
}

function coordinatesValue(package, start) {
  const value = package.substring(start, start + 7);
  const degrees = value.substring(0, 2);
  const minutes = value.substring(2, 4);
  const minutesDecimals = value.substring(4, 7);
  return `${degrees}${minutes}.${minutesDecimals}`;
}

function speedValue(package) {
  const hexSpeed = package.substring(46, 48);
  const decimalSpeed = parseInt(hexSpeed, 16) / 100;
  return decimalSpeed;
}

function vehicleState(package) {
  const stateHex = package.substring(62, 70);
  const stateBinary = stateHex.padStart(8, "0");
  const states = {
    firstByte: {
      AccStatus: stateBinary[7],
      MainPower: stateBinary[3],
    },
  };
  return states;
}

function parsePackage(package) {
  const header = package.substring(0, 4);
  const terminalID = package.substring(10, 18);
  const date = package.substring(18, 24);
  const time = package.substring(24, 30);
  const latitudeOrientation = package[30];
  const latitudeValue = coordinatesValue(package, 31);
  const longitudeOrientation = package[38];
  const longitudeValue = coordinatesValue(package, 39);
  const direction = package.substring(48, 50);
  const gpsAntenna = package.substring(50, 52);
  const km = package.substring(52, 58);
  const vehicleStateData = vehicleState(package);
  const st901Formatted = {
    header: header,
    imei: terminalID,
    dataType: "V1",
    time,
    valid: "A",
    latitudeValue,
    latitudeOrientation,
    longitudeValue,
    longitudeOrientation,
    speed: speedValue(package),
    direction,
    date,
    vehicleState: vehicleStateData,
    gpsAntenna,
  };

  if (terminalID.length < 12) {
    const zerosToAdd = 12 - terminalID.length;
    const paddedTerminalId = `0${zerosToAdd}${terminalID}`;
    st901Formatted.imei = paddedTerminalId;
  }

  const nuevoPaquete = JSON.stringify(st901Formatted);
  return nuevoPaquete;
}

const package =
  "292980002846914885230824183101833048748682820600240208ffff000002fc0000001e78080a0000341a0d";
const parsedData = parsePackage(package);
console.log(parsedData);
