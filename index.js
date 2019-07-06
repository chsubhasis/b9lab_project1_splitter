import Web3 from "web3";
import splitterArtifact from "../../build/contracts/Splitter.json";

const App = {
  web3: null,
  account: null,
  splitter: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = splitterArtifact.networks[networkId];
      this.splitter = new web3.eth.Contract(
        splitterArtifact.abi,
        deployedNetwork.address
      );

      // get accounts
      console.log(web3.eth.getAccounts());
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      document.getElementById("ca").value = this.splitter.address;
      document.getElementById("alice").value = accounts[0];
      
      web3.eth.getBalance(accounts[0],function (error, result){
        if (error) {
          console.log("Error:"+error);
        } else {
          document.getElementById("alb").value = web3.utils.fromWei(result,'ether').toString(10);
        }
      });

      web3.eth.getBalance(document.getElementById("bob").value,function (error, result){
        if (error) {
          console.log("Error:"+error);
        } else {
          document.getElementById("blb").value = web3.utils.fromWei(result,'ether').toString(10);
        }
      });

     web3.eth.getBalance(document.getElementById("carol").value,function (error, result){
        if (error) {
          console.log("Error:"+error);
        } else {
          document.getElementById("clb").value = web3.utils.fromWei(result,'ether').toString(10);
        }
      });


    } catch (error) {
      console.error("Could not connect to contract or chain."+error);
    }
  },

  sendCoin: async function() {
    const { getBalanceAlice } = this.splitter.methods;
    const { getBalanceBob } = this.splitter.methods;
    const { getBalanceCarol } = this.splitter.methods;
    const { splitMe } = this.splitter.methods;
    await splitMe().send({ from: this.account, value: document.getElementById("se").value }, async function(error, result){
      if (error) {
        console.log("Error:"+error);
      } else {
        const aliceBalance = await getBalanceAlice().call();
        const bobBalance = await getBalanceBob().call();
        const carolBalance = await getBalanceCarol().call();
        console.log("Alice balance is "+ aliceBalance) ;
        console.log("Bob balance is "+ bobBalance) ;
        console.log("Carol balance is "+ carolBalance) ;
        document.getElementById("alb").value = aliceBalance / 1000000000000000000;
        document.getElementById("blb").value = bobBalance / 1000000000000000000;
        document.getElementById("clb").value = carolBalance / 1000000000000000000;
      }
    });
  },

  setStatus: async function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: async function() {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
    );
  }

  App.start();
});
