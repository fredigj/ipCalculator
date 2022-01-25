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

// point A
const networkClass = (octet) => {
    if(octet>=0 && octet<=127) return 'A'
    if(octet>=128 && octet<=191) return 'B'
    if(oct>=192 && oct<=223) return 'C'
    return null;
}

function findNetwork(nClass, octet1, octet2, octet3){
    if(nClass === 'A') return `${octet1}.0.0.0`
    if(nClass === 'B') return `${octet1}.${octet2}.0.0`
    if(nClass === 'C') return `${octet1}.${octet2}.${octet3}.0`
    return null
}    

const sameNetwork = (ip1, ip2) => {
    const network1 = findNetwork(networkClass(parseInt(ip1[0])), ip1[0], ip1[1], ip1[2]);
    const network2 = findNetwork(networkClass(parseInt(ip2[0])), ip2[0], ip2[1], ip2[2]);
    console.log(network1, network2);
    if(network1 == null || network2 == null){
        alert(`IPs not valid`);
    }
    else if(network1 == network2){
        document.querySelector('.result-a').textContent = `Same network: Yes`;
    }else{
        document.querySelector('.result-a').textContent = `Same network: No`;
    }
}

const validateA = (e) => {
    e.preventDefault();
    const ip1 = formA.querySelector('#ip1').value;
    const ip2 = formA.querySelector('#ip2').value;
    if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip1) && /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip2)){
        sameNetwork(ip1.split('.'), ip2.split('.'));
    }else{
        alert(`IPs not valid`);
    }
}

calculateA.addEventListener('click', validateA);
// end point A

// point B

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
        var sbstr = str.substr(index,num);
        var dec = convertToDecimal(sbstr);
        newString+=dec+c;
    }
    newString = newString.substr(0, newString.length-1);
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

const generateNetworkIdnBroadcastId = (ip1, sub) => {
    let ip = `${binaryConvertor(ip1[0],8)}${binaryConvertor(ip1[1],8)}${binaryConvertor(ip1[2],8)}${binaryConvertor(ip1[3],8)}`;
    let res = ip.substr(0, sub);
    let networkId = fill(res, '0', 32);
    networkId = eDecimal(networkId,'.', 8);
    let broadcastId = fill(res,'1',32);
    broadcastId = eDecimal(broadcastId,'.', 8);
    document.querySelector('.result1-b').textContent = `Network ID: ${networkId}`;
    document.querySelector('.result2-b').textContent = `Broadcast ID: ${broadcastId}`;
}

const validateB = (e) => {
    e.preventDefault();
    if(!formB.querySelector('#ip1').value.includes("/")){
        alert("Subnet mask not valid");
        return
    }
    const ip1 = formB.querySelector('#ip1').value.split('/');
    if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip1[0]) && (ip1[1] >= 0 && ip1[1] <= 32)){
        generateNetworkIdnBroadcastId(ip1[0].split("."), ip1[1]);
    }else{
        alert(`IPs not valid`);
    }
}

calculateB.addEventListener('click', validateB);
// end point B

// point C
const generateSubnetIdnBroadcastId = (ip1, sub) => {
    let ip = `${binaryConvertor(ip1[0],8)}${binaryConvertor(ip1[1],8)}${binaryConvertor(ip1[2],8)}${binaryConvertor(ip1[3],8)}`;
    let res = ip.substr(0, sub);
    let broadcastId = fill(res,'1',32);
    broadcastId = eDecimal(broadcastId,'.', 8);
    let subnetId = "";
    for (var i=1; i<=sub; i++){
        subnetId+="1";
    }
    subnetId = fill(subnetId,'0',32);
    subnetId = eDecimal(subnetId,'.', 8);
    document.querySelector('.result1-b').textContent = `Subnet ID: ${subnetId}`;
    document.querySelector('.result2-b').textContent = `Broadcast ID: ${broadcastId}`;
}

const validateC = (e) => {
    e.preventDefault();
    if(!formB.querySelector('#ip1').value.includes("/")){
        alert("Subnet mask not valid");
        return
    }
    const ip1 = formB.querySelector('#ip1').value.split('/');
    if(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip1[0]) && (ip1[1] >= 0 && ip1[1] <= 32)){
        generateSubnetIdnBroadcastId(ip1[0].split("."), ip1[1]);
    }else{
        alert(`IPs not valid`);
    }
}

calculateC.addEventListener('click', validateC);
// end point C