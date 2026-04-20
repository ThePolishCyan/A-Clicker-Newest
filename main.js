			var Game = {
				score: 0,
				totalClicks: 0,
				totalScore: 0,
				ClickPower: 1,
				version: 1.1,
				hoverUpgrade: -1,
				lastClickTime: 0,
				clickCooldown: 66.6667,
				
				AddToScore: function(amount) {
					var currentTime = Date.now();
					var img = document.getElementById("clicker");
					if (currentTime - Game.lastClickTime >= Game.clickCooldown) {
						this.score += amount;
						this.totalScore += amount;
						display.updateScore();
						Game.lastClickTime = currentTime
						
						img.classList.add("clicking")
						
						setTimeout(function() {
							img.classList.remove("clicking");
						}, 20)
					}
				},
				
				getSPS: function() {
					var SPS = 0;
					for (i = 0; i < building.name.length; i++) {
						SPS += building.income[i] * building.count[i];
					}
					return SPS;
				}
			};
			
			var building = {
				name: [
					"Alpha",
					"Beta",
					"Gamma",
					"Delta"
				],
				image: [
					"Alpha.png",
					"Beta.png",
					"Gamma.png",
					"Delta.png"
				],
				count: [0, 0, 0, 0],
				income: [
					1,
					4,
					16,
					64
				],
				cost: [
					50,
					300,
					2000,
					15500
				],
			
				purchase: function(index) {
					if (Game.score >= this.cost[index]) {
							Game.score -= this.cost[index];
							this.count[index]++;
							this.cost[index] = Math.ceil(this.cost[index] * 1.10);
							display.updateScore();
							display.updateUpgrades();
							display.updateShop();
					}
				}
			};
			
			var upgrade = {
				name: [
					"Tiny Alpha",
					"Tiny Beta",
					"Alpha Clicks"
				],
				description: [
					"Alphas are twice as efficient",
					"Betas are twice as efficient",
					"Clicks are 4x more efficient"
				],
				image: [
					"Alpha.png",
					"Beta.png",
					"AlphaClicks.png"
				],
				type: [
					"building",
					"building",
					"click"
				],
				cost: [
					250,
					1000,
					500
					
				],
				buildingIndex: [
					0,
					1,
					-1
				],
				requirement: [
					5,
					5,
					100
				],
				bonus: [
					2,
					2,
					4
				],
				purchased: [false, false, false],
				
				purchase: function(index) {
					if (!this.purchased[index] && Game.score >= this.cost[index]) {
						if (this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
							Game.score -= this.cost[index];
							building.income[this.buildingIndex[index]] *= this.bonus[index];
							this.purchased[index] = true;
							
							display.updateUpgrades();
							display.updateScore();
						} else if (this.type[index] == "click" && Game.totalClicks >= this.requirement[index]) {
							Game.score -= this.cost[index];
							Game.ClickPower *= this.bonus[index];
							this.purchased[index] = true;
							
							display.updateUpgrades();
							display.updateScore();
						}
						onmouseout="display.displayUpInfo(-1)"
					}
				}
			};
			
			var display = {
				updateScore: function() {
					document.getElementById("score").innerHTML = Game.score;
					document.getElementById("SPS").innerHTML = Game.getSPS();
					document.getElementById("totalClicks").innerHTML = Game.totalClicks;
					document.getElementById("scoreI").innerHTML = Game.score;
					document.getElementById("totalScore").innerHTML = Game.totalScore;
					document.getElementById("clickPower").innerHTML = Game.ClickPower;
					document.getElementById("version").innerHTML = Game.version;
					document.title = Game.score + " A - A Clicker";
				},
				
				updateShop: function() {
					document.getElementById("shopContainer").innerHTML = "";
					for (i = 0; i < building.name.length; i++) {
						document.getElementById("shopContainer").innerHTML += '<table class="shopButton" onclick="building.purchase('+i+')"><td id="image"><img src="images/'+building.image[i]+'"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> A</p></td><td id="amount"><span>'+building.count[i]+'</span></td></table>'
					}
				},
				
				updateUpgrades: function() {
					document.getElementById("UpgradeContainer").innerHTML = "";
					for (i = 0; i < upgrade.name.length; i++) {
						if (!upgrade.purchased[i]) {
							if (upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
								document.getElementById("UpgradeContainer").innerHTML += '<img src="images/'+upgrade.image[i]+'" title="'+upgrade.name[i]+' &#10; '+upgrade.description[i]+' &#10; ('+upgrade.cost[i]+' A)" onclick="upgrade.purchase('+i+')" onmouseover="display.displayUpInfo('+i+')" onmouseout="display.displayUpInfo(-1)"/>';
							} else if (upgrade.type[i] == "click" && Game.totalClicks >= upgrade.requirement[i]) {
								document.getElementById("UpgradeContainer").innerHTML += '<img src="images/'+upgrade.image[i]+'" title="'+upgrade.name[i]+' &#10; '+upgrade.description[i]+' &#10; ('+upgrade.cost[i]+' A)" onclick="upgrade.purchase('+i+')" onmouseover="display.displayUpInfo('+i+')" onmouseout="display.displayUpInfo(-1)"/>';
							}
						}
					}
				},
				displayUpInfo: function(index) {
					if (index == -1) {
						document.getElementById("upgradeCost").innerHTML = "";
						document.getElementById("descUp").innerHTML = "an upgrade";
						document.getElementById("titleUp").innerHTML = "hover over";
					}
					else {
						document.getElementById("upgradeCost").innerHTML = ''+upgrade.cost[index]+' A';
						document.getElementById("descUp").innerHTML = ''+upgrade.description[index]+'';
						document.getElementById("titleUp").innerHTML = ''+upgrade.name[index]+'';
					}
				}
			};
			
			function saveGame() {
				var GameSave = {
					score: Game.score,
					totalClicks: Game.totalClicks,
					totalScore: Game.totalScore,
					ClickPower: Game.ClickPower,
					version: Game.version,
					buildingCount: building.count,
					buildingIncome: building.income,
					buildingCost: building.cost,
					upgradePurchased: upgrade.purchased
				};
				localStorage.setItem("GameSave", JSON.stringify(GameSave));
			};
			
			function loadGame() {
				var SavedGame = JSON.parse(localStorage.getItem("GameSave"))
				if (localStorage.getItem("GameSave") !== null) {
					if (typeof SavedGame.score !== "undefined") Game.score = SavedGame.score
					if (typeof SavedGame.totalClicks !== "undefined") Game.totalClicks = SavedGame.totalClicks
					if (typeof SavedGame.totalScore !== "undefined") Game.totalScore = SavedGame.totalScore
					if (typeof SavedGame.ClickPower !== "undefined") Game.ClickPower = SavedGame.ClickPower
					if (typeof SavedGame.buildingCount !== "undefined") {
						for (i = 0; i < SavedGame.buildingCount.length; i++) {
							building.count[i] = SavedGame.buildingCount[i]
						}
					}
					if (typeof SavedGame.buildingCost !== "undefined") {
						for (i = 0; i < SavedGame.buildingCost.length; i++) {
							building.cost[i] = SavedGame.buildingCost[i]
						}
					}
					if (typeof SavedGame.buildingIncome !== "undefined") {
						for (i = 0; i < SavedGame.buildingIncome.length; i++) {
							building.income[i] = SavedGame.buildingIncome[i]
						}
					}
					if (typeof SavedGame.upgradePurchased !== "undefined") {
						for (i = 0; i < SavedGame.upgradePurchased.length; i++) {
							upgrade.purchased[i] = SavedGame.upgradePurchased[i]
						}
					}
				}
			}
			
			function ResetGame() {
				if (confirm("Do you want to reset everything in the game")) {
					var GameSave = {};
					localStorage.setItem("GameSave", JSON.stringify(GameSave));
					location.reload();
				}
			}
			
			document.getElementById("clicker").addEventListener("click", function() {
				Game.totalClicks++;
				Game.AddToScore(Game.ClickPower);
			}, false);
			
			setInterval(function() {
				saveGame()
			}, 15000);
			
			window.onload = function() {
				loadGame();
				display.updateScore();
				display.updateShop();
				display.updateUpgrades();
			};
			
			setInterval(function() {
				Game.score += Game.getSPS();
				Game.totalScore += Game.getSPS();
				display.updateScore();
			}, 1000);
			
			setInterval(function() {
				display.updateScore();
				display.updateUpgrades();
			}, 1000);
			
			document.addEventListener("keydown", function(event) {
				if (event.ctrlKey && event.which == 83) {
					event.preventDefault();
					saveGame();
				}
			}, false);
			