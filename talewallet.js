WALLET_NAME = "ICC Wallet";
NFTVERSE_DEV_API = "https://us-dev.api.onnftverse.com/v1";
BLOCKCHAIN_SERVICE = "https://bs-dev.api.onnftverse.com/v1";
app_token = 123;

function loginUI() {
  document.getElementById("wallet_div").innerHTML =
    `<div class="flex flex-col gap-10">
        <div class="imgcontainer">
        <img src="./images/talewallet.png" alt="Avatar" class="avatar">
        </div>
        <div class="flex flex-col items-center">
            <div class = "font-bold text-2xl text-tale">Welcome to ` +
    WALLET_NAME +
    `</div>
            <div class = "font-semibold text-lg">Veirfy your email address</div>
        </div>
        <div class="flex flex-col gap-20 items-start" id="email_address_input">
                    <div class="flex shadow-1 w-full  email-input-container">
                    <span><img src="./images/mail.svg" class=""/></span>
                    <input type="text" class= "border-none outline-none" placeholder="Enter your email" name="uname" id="otp_email_address" required>
                    </div>
                    <div class="w-full">
                    <span id="sb_rb_error"></span>
                    <button class="btn primary-btn" type="submit" id="sbt_email_otp_btn">Continue</button>
        </div>
        
        <div class="text-center w-full">You will get an OTP on this email</div>
        </div>`;
  var link = document.getElementById("sbt_email_otp_btn");
  // onClick's logic below:
  if (link) {
    link.addEventListener("click", function () {
      sendOTP(document.getElementById("otp_email_address").value);
    });
  }
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function sendOTP(email) {
  if (!validateEmail(email)) {
    document.getElementById("sb_rb_error").innerHTML =
      "<span>Email id is expected</span>";
  } else {
    let config = {
      method: "post",
      headers: {
        "X-App-Token": app_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    };

    fetch(`${NFTVERSE_DEV_API}/otp/send?type=login`, config).then((res) => {
      document.getElementById(
        "email_address_input"
      ).innerHTML = `<div class="flex shadow-1 w-full  email-input-container" id="otp-container">
                    <input type="text" class = "border-none outline-none mt-10 " placeholder="Enter OTP received on your mail" name="uname" id="input_otp" required>
            </div> <span id="sb_rb_error" style="color:red"></span>
                    <button type="submit"  id="submit_otp_btn" class="btn primary-btn mt-10">Submit Otp</button>
        <div>In future you will be able to access your account using this email and OTP</div>
                </div>`;
      document.getElementById("sb_rb_error").innerHTML = "";
      const submitOtpBtn = document.getElementById("submit_otp_btn");
      submitOtpBtn.addEventListener("click", function () {
        verifyOtp(email, document.getElementById("input_otp").value);
      });
    });
  }
}

function verifyOtp(email, otp) {
  console.log(otp);
  if (!otp) {
    document.getElementById("sb_rb_error").innerHTML =
      "<span>Otp is expected</span>";
  } else {
    let config = {
      method: "post",
      headers: {
        "X-App-Token": app_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: otp,
      }),
    };
    fetch(`${NFTVERSE_DEV_API}/otp/verify?type=login`, config)
      .then((res) => res.json())
      .then((res) => {
        getOrSetupWallet(res.userId, res.authToken);
      })
      .catch(
        (rej) =>
          (document.getElementById("sb_rb_error").innerHTML =
            "<span>Wrong otp</span>")
      );
  }
}
function getOrSetupWallet(userId, authToken) {
  localStorage.setItem("wallet_authToken", authToken);
  localStorage.setItem("userId", userId);
  let config = {
    method: "get",
    headers: {
      "X-Auth-Token": authToken,
      "Content-Type": "application/json",
    },
  };

  fetch(`${BLOCKCHAIN_SERVICE}/user/blockchain/account`, config)
    .then((res) => res.json())
    .then((res) => {
      const talewallet = res?.filter(
        (wallet) => wallet.wallet === "TALEWALLET"
      );
      if (talewallet?.length === 0) {
        setUpTaleWallet(authToken);
      } else {
        localStorage.setItem("tale_wallet_address", talewallet[0].address);
        showWalletUI(talewallet[0].address);
      }
    })
    .catch(
      (rej) =>
        (document.getElementById("sb_rb_error").innerHTML =
          "<span>Having trouble getting account try again later</span>")
    );
}

function setUpTaleWallet(authToken) {
  let config = {
    method: "post",
    headers: {
      "X-Auth-Token": authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      blockchain: "ALGORAND",
      wallet: "TALEWALLET",
      marketplaceAddress: 0,
    }),
  };
  fetch(`${BLOCKCHAIN_SERVICE}/user/blockchain/wallet/setup`, config)
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("tale_wallet_address", res.address);
      document.getElementById("wallet_div").innerHTML = "";
      showWalletUI(res.address);
    })
    .catch((rej) => console.log(rej));
}

// --------------------------------------------------------------

function showWalletUI(tale_wallet_address) {
  document.getElementById("wallet_div").innerHTML = `
            <div class="flex justify-between items-center">
           
            <div class="hidden" id="modal-container">
                    
                </div>
            </div>
            <div class="flex flex-col items-center gap-20" style="margin-top: 50px;">
            <div class = "text-lg font-bold flex justify-around items-center shadow-xl wallet-address-container">
                <div>
                    <img src="./images/ellipse.svg" class="w-40 h-40 object-contain" />
                </div>
                <div style=" overflow: hidden; text-overflow: ellipsis;" class="w-100 font-bold" id="tale_wallet_address">  ${tale_wallet_address}</div>
                <div  id="copy_to_clipboard"> <img src="./images/copy.png" alt="Copy Address" width="25"/> </div>
            </div>
                
                <div class="flex flex-col items-center">
                    <div class="relative z-10">
                        <img src="./images/algorandhexagon.svg" class="w-50" />
                    </div>
                    <div  id="wallet_balance" class="text-2xl font-bold text-tale"> 
                    <h1 id='balance'></h1></div>
                </div>
            <div class="flex gap-20 justify-center">
                <button class="btn primary-btn" id="buy-btn">Buy</button>
                <button class="btn  secondary-btn" id="sell-btn">Send</button>
            </div>
            </div>
                
        
        




        <div class="tab" style="margin-top: 50px;">
          <button class="tablinks font-bold" onclick="handleTablClick(event, 'NFTs')" id="defaultOpen">NFTs</button>
          <button class="tablinks font-bold" onclick="handleTablClick(event, 'Tokens')">Tokens</button>
          <button class="tablinks font-bold" onclick="handleTablClick(event, 'Activity')">Activity</button>
        </div>

        <div id="NFTs" class="tabcontent">
          <h3>NFTs</h3>
          <div class="flex flex-wrap gap-20" id="wallet_asset_container"></div>
        </div>

        <div id="Tokens" class="tabcontent">
          <h3>Tokens</h3>
          <p>Tokens content will appear here.</p> 
        </div>

        <div id="Activity" class="tabcontent">
          <h3>Activity</h3>
          <p>Activity content will appear here.</p>
        </div>


        
    </div>`;
  fetchTokenBalance(tale_wallet_address);
  fetchList(tale_wallet_address);
  defaultOpen();
}

function fetchTokenBalance(tale_wallet_address) {
  const authtoken = localStorage.getItem("wallet_authToken");
  fetch(
    `https://bs-dev.api.onnftverse.com/v1/user/wallet/balance?blockchain=ALGORAND&address=${tale_wallet_address}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authtoken,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const balanceContainer = document.getElementById("wallet_balance");
      const balanceElement = document.getElementById("balance");
      balanceElement.textContent = data.balance;
      balanceContainer.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching balance:", error);
    });
}

function fetchList(tale_wallet_address) {
  const authtoken = localStorage.getItem("wallet_authToken");
  const nftcontainer = document.getElementById("wallet_asset_container");

  fetch(
    `https://bs-dev.api.onnftverse.com/v1/user/${tale_wallet_address}/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authtoken,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const content = data.content;
      const promises = content.map((item) => {
        let reducedhash = item.params.url.replace("ipfs://", "");
        return fetch(`https://ipfs.io/ipfs/${reducedhash}`)
          .then((response) => response.json())
          .then((data) => {
            newurl = data.image.replace("ipfs://", "");
            const img = document.createElement("img");
            img.src = `https://ipfs.io/ipfs/${newurl}`;
            img.style.width = "400px";
            img.style.height = "600px";
            nftcontainer.appendChild(img);
          });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello World!");
  var authToken = localStorage.getItem("authToken");
  var tale_wallet_address = localStorage.getItem("tale_wallet_address");
  if (tale_wallet_address) {
    showWalletUI(tale_wallet_address);
  } else {
    loginUI();
  }
});

function handleTablClick(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active ";
}

function defaultOpen() {
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();
}