const playerContainer = document.getElementById('player-container');

const lastBetDisplay = document.getElementById('last-bet');
const betQuantityInput = document.getElementById('bet-quantity');
const betValueInput = document.getElementById('bet-value');

const startGameButton = document.getElementById('start-game');
const addPlayerButton = document.getElementById('add-player');
const removePlayerButton = document.getElementById('remove-player');
const rollButton=document.getElementById('roll-button')
const checkButton=document.getElementById('check-button')
const finishButton=document.getElementById('finish-button')
const openButton=document.getElementById('open-button')
const placeBetButton = document.getElementById('place-bet');





let playerIdCounter = 1; // Initialize with 1
let currentPlayerId = 0; // Initialize with 0
let totalPlayers = 0;    // 
let currentPlayerIndex = 0;

//上一个玩家的bet
let lastBetQuantity = 0;
let lastBetValue = 0;
//每轮需要的operation
let have_bet=0;
let have_rolled=0;
let all_have_rolled=0;

//游戏开始前的功能：增删玩家
    //todo:皮肤选择/数据库查看等
    //添加玩家
    addPlayerButton.addEventListener('click', addPlayer);
    function addPlayer() {
        //新建playerCup并设置属性
        const playerCup = document.createElement('div');

        playerCup.classList.add('player-cup');
        playerCup.setAttribute('id', `dice-cup${playerIdCounter}`);
        //添加骰子
        for (let i = 0; i < 5; i++) {
            const dice = document.createElement('div');
            dice.classList.add('dice');
            dice.innerHTML = '&#9860;';
            playerCup.appendChild(dice);
        }
        //添加箭头并设置属性
        const arrow = document.createElement('div');
        arrow.classList.add('arrow');
        arrow.setAttribute('id', `arrow${playerIdCounter}`);
        arrow.textContent = `Player ${playerIdCounter}'s Action`;
        playerCup.appendChild(arrow);
        //添加到玩家池中
        playerContainer.appendChild(playerCup);
        totalPlayers++;
        playerIdCounter++;
    }
    //删除玩家
    removePlayerButton.addEventListener('click', removePlayer);
    function removePlayer() {
        if (totalPlayers > 0) {
            const lastPlayer = document.getElementById(`dice-cup${playerIdCounter - 1}`);
            playerContainer.removeChild(lastPlayer);
            totalPlayers--;
            playerIdCounter--;
        }
    }
    //开始游戏按钮
    startGameButton.addEventListener('click', () => {
        if(totalPlayers<2){
          alert('Please add player!')
          return;
        }
        //隐藏增减玩家以及开始游戏按钮
        addPlayerButton.style.display = 'none';
        removePlayerButton.style.display = 'none';
        startGameButton.style.display = 'none';
        // 出现操作按钮:Roll、Check、Finish
        rollButton.style.display = 'inline-block';
        checkButton.style.display = 'inline-block';
        finishButton.style.display = 'inline-block';
        // Show place bet button
        placeBetButton.style.display = 'inline-block';

        //开始游戏
        currentPlayerIndex = 0;
        currentPlayerId = 1;
        startPlayerTurn();
        showPlayerControls();
    });
    //roll的逻辑
    //根据点数显示骰子面
    function getDiceFace(rollResult) {
        switch (rollResult) {
          case 1:
            return "&#9856;";
          case 2:
            return "&#9857;";
          case 3:
            return "&#9858;";
          case 4:
            return "&#9859;";
          case 5:
            return "&#9860;";
          case 6:
            return "&#9861;";
          default:
            return "";
        }
      }
    //对roll按钮的响应
    rollButton.addEventListener("click", () => 
    {
      if(all_have_rolled==1||have_rolled==1){
        alert('You have rolled already!')
      }
      else
      {
        const currentPlayerCup = document.getElementById(`dice-cup${currentPlayerId}`);
        const dices = currentPlayerCup.querySelectorAll('.dice');
        dices.forEach(dice => {
          dice.classList.add("roll-animation");
          setTimeout(() => {
            dice.classList.remove("roll-animation");
            const rollResult = Math.floor(Math.random() * 6) + 1;
            const diceFace = getDiceFace(rollResult);
            dice.innerHTML = diceFace;
          }, 1000);
          }
        )
      have_rolled=1;
      }
    }); 
    //check的逻辑
    //finish的逻辑

//游戏开始后的逻辑:
    //玩家行动回合前的准备
    function startPlayerTurn() {
        //指示玩家的箭头
        const arrows = document.querySelectorAll('.arrow');
        arrows.forEach(arrow => arrow.style.display = 'none');
        const currentArrow = document.getElementById(`arrow${currentPlayerId}`);
        currentArrow.style.display = 'inline-block';
    }
    //下注并更新当前注码
    placeBetButton.addEventListener('click', placeBet);
    function placeBet() {
      if(all_have_rolled==0){
        if(have_rolled==0){
          alert('Please Roll First!');
          return;
        }
      }
      if(have_bet==1){
        alert('You have bet already!');
        return;
      }
      if(have_bet==0){
        const quantity = parseInt(betQuantityInput.value);
        const value = parseInt(betValueInput.value);
        if (!quantity || !value || quantity < 1 || value < 1 || value > 6||quantity<lastBetQuantity||(quantity==lastBetQuantity&&value<=lastBetValue)) {
            alert('Please enter valid quantity and value.');
            return;
        }
        updateLastBet(quantity, value);
        betQuantityInput.value = ''; // Clear input fields
        betValueInput.value = '';
        have_bet=1;
      }
    }
    function updateLastBet(quantity, value) {
        lastBetQuantity = quantity;
        lastBetValue = value;
        lastBetDisplay.textContent = `${quantity} ${value}`;
    }
    
    //finish的逻辑
    finishButton.addEventListener('click',endPlayerTurn);
    function endPlayerTurn() {
        //检查是否roll过
        if(all_have_rolled==0){
          if(have_rolled==0){
            alert('Please Roll First!');
            return;
          }
        }
        //检查是否bet过
        if(have_bet==0){
          alert('Please Bet!');
          return;
        }
        //还原状态
        have_rolled=0;
        have_bet=0;
        //下一位玩家开始行动
        currentPlayerIndex++;
        if (currentPlayerIndex >= totalPlayers) {
          all_have_rolled=1;
          currentPlayerIndex = 0;
        }
        currentPlayerId = currentPlayerIndex + 1;
        startPlayerTurn();
    }
    //open的逻辑
    openButton.addEventListener('click',open);
    function sum(value){
        const all_dices=document.querySelectorAll('.dice');
        let count=0;
        switch(value){
            case 1:{
                all_dices.forEach(dice=>{if(dice.innerHTML=="&#9856;")
                    count++;
                })
            break;}
          case 2:
            {
                all_dices.forEach(dice=>{if(dice.innerHTML=="&#9857;")
                    count++;
                })
            break;}
          case 3:
            {
                all_dices.forEach(dice=>{if(dice.innerHTML=="&#9858;")
                    count++;
                })
            break;}
          case 4:
            {
                all_dices.forEach(dice=>{if(dice.innerHTML=="&#9859;")
                    count++;
                })
            break;}
          case 5:
            {
                all_dices.forEach(dice=>{if(dice.innerHTML=="&#9860;")
                    count++;
                })
            break;}
          case 6:
            {
                all_dices.forEach(dice=>{if(dice.innerHTML=="&#9861;")
                    count++;
                })
            break;}
          default:
            break;
        }
        return count;
    }
    function open(){
        let current_num=sum(lastBetValue);
        //显示所有骰子
        //当前玩家失败
        if(current_num>=lastBetQuantity){
        alert('you lose!');
        }
        //上一位玩家失败
        else{
          alert('you win!')
        }
        //结算并重新开始
    }
//todo:游戏结束后,显示排行榜







