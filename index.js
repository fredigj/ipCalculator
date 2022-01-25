const calculateA = document.querySelector('.pika-a');
const calculateB = document.querySelector('.pika-b');
const calculateC = document.querySelector('.pika-c');

const formA = document.querySelector('.form-a');
const formB = document.querySelector('.form-b');
const formC = document.querySelector('.form-c');

const activate = (option) => {
    switch(option){
        case 'A':
            formA.classList.remove('hidden');
            formB.classList.add('hidden');
            formC.classList.add('hidden');
            break;
        case 'B':
            formA.classList.add('hidden');
            formB.classList.remove('hidden');
            formC.classList.add('hidden');
            break;
        case 'C':
            formA.classList.add('hidden');
            formB.classList.add('hidden');
            formC.classList.remove('hidden');
            break;
    }
}

const getBinaryIp = (ip) => {
    return `${binaryConvertor(ip[0], 8)}${binaryConvertor(ip[1], 8)}${binaryConvertor(ip[2], 8)}${binaryConvertor(ip[3], 8)}`;
}

const stringReverse = (str) => {
    if (str === ""){
        return ""
    }else{
        return stringReverse(str.substr(1)) + str.charAt(0)
    }
}

const binaryConvertor = (number, size) => {
    var res = "";
    while (number!=0){
        var reminder = number%2;
        res = res+reminder;
        number = parseInt(number/2);
    }
    res = fill(res, '0', size);
    res = stringReverse(res);
    return res;
}

const convertToDecimal = (number) =>{
    let maxPower = number.length-1;
    let sum = 0;
    for(let i=0; i<number.length; i++){
        if(number.charAt(i) == '1'){
            sum += Math.pow(2, maxPower-i);
        }
    }
    return sum;
}

function eDecimal (str, c, num){
    let newString = "";
    for (let index=0; index < str.length; index=index+num){
        var sbstr = str.slice(index, index+num);
        var dec = convertToDecimal(sbstr);
        newString+=dec+c;
    }
    newString = newString.slice(0, newString.length-1);
    return newString;
}

const fill = (word, c, length) => {
    let str = word;
    let size = word.length; 
    for (let i=1; i <= length-size; i++){
        str= str+c;
    }
    return str;
}


// point A

const sameNetwork = (ip1, ip1sub, ip2, ip2sub) => {
    let network1 = getBinaryIp(ip1);
    let network2 = getBinaryIp(ip2);
    network1 = network1.slice(0, ip1sub);
    network2 = network2.slice(0, ip2sub);
    const res1 = fill(network1, '0', 32);
    const res2 = fill(network2, '0', 32);
    if(res1 == res2){
        document.querySelector('.result-a').textContent = `Same network: Yes`;
    }else{
        document.querySelector('.result-a').textContent = `Same network: No`;
    }
}

const validateA = (e) => {
    e.preventDefault();
    let ip1 = formA.querySelector('#ip1').value;
    let ip2 = formA.querySelector('#ip2').value;
    if(!ip1.includes("/") && !ip2.includes("/")){
        alert("IPs not valid");
        return
    }
    ip1 = ip1.split('/');
    ip2 = ip2.split('/');
    if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip1[0]) && 
        /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip2[0]) && 
        ip1[1] &&
        ip2[1] &&
        (ip1[1] >= 0 && ip1[1] <= 32) &&
        (ip2[1] >= 0 && ip2[1] <= 32))
    {
        sameNetwork(ip1[0].split('.'), ip1[1], ip2[0].split('.'), ip2[1]);
    }else{
        alert(`IPs not valid`);
    }
}

calculateA.addEventListener('click', validateA);
// end point A

// point B



const generateNetworkIdnBroadcastId = (ip1, sub) => {
    let ip = getBinaryIp(ip1);
    let res = ip.slice(0, sub);
    let networkId = fill(res, '0', 32);
    networkId = eDecimal(networkId,'.', 8);
    let broadcastId = fill(res,'1',32);
    broadcastId = eDecimal(broadcastId,'.', 8);
    document.querySelector('.result1-b').textContent = `Network ID: ${networkId}`;
    document.querySelector('.result2-b').textContent = `Broadcast ID: ${broadcastId}`;
}

const validateB = (e) => {
    e.preventDefault();
    let ip1 = formB.querySelector('#ip1').value;
    if(!ip1.includes("/")){
        alert("IP not valid");
        return
    }
    ip1 = ip1.split('/');
    if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip1[0]) && ip1[1] && (ip1[1] >= 0 && ip1[1] <= 32)){
        generateNetworkIdnBroadcastId(ip1[0].split("."), ip1[1]);
    }else{
        alert(`IP not valid`);
    }
}

calculateB.addEventListener('click', validateB);
// end point B

// point C

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

const generateSubnetIdnBroadcastId = (networkId, numberOfSubs) => {
    let ip = getBinaryIp(networkId.split("."));
    let mask = ip.lastIndexOf("1");
    let numOfBits = numberOfSubs%2 === 0 ? 0 : 1;
    for(let i = 2; i<=numberOfSubs; i *= 2){
        numOfBits += 1;
    }
    let cidr = "";
    for(let i = 0; i<ip.length;i++){
        if(i<=mask){
            cidr += "1";
        }else{
            cidr += "0";
        }
    }
    const subnetMask = eDecimal(cidr,'.', 8);
    document.querySelector('.result1-c').textContent = `Subnet ID: ${subnetMask}`;
    console.log(ip);
    let broadcastBinary = "";
    for(let i = 0; i<ip.length;i++){
        if(i>=mask+numOfBits){
            broadcastBinary += "1";
        }else{
            broadcastBinary += ip.charAt(i);
        }
    }
    const broadcastId = eDecimal(broadcastBinary,'.', 8);
    document.querySelector('.result2-c').textContent = `Broadcast ID: ${broadcastId}`;

}

const validateC = (e) => {
    e.preventDefault();
    const networkId = formC.querySelector('#ip1').value;
    const numberOfSubs = formC.querySelector('#numberOfSubs').value;
    if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(networkId) && /^[0-9]*$/.test(numberOfSubs)){
        generateSubnetIdnBroadcastId(networkId, numberOfSubs);
    }else{
        alert(`IPs not valid`);
    }
}

calculateC.addEventListener('click', validateC);
// end point C