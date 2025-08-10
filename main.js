			var Game = {
				score: 0,
				totalClicks: 0,
				totalScore: 0,
				ClickPower: 1,
				version: 1.0,
				
				AddToScore: function(amount) {
					this.score += amount;
					this.totalScore += amount;
					display.updateScore();
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
					"Beta"
				],
				image: [
					"Alpha.png",
					"Beta.png"
				],
				count: [0, 0],
				income: [
					1,
					4
				],
				cost: [
					50,
					175
				],
			
				purchase: function(index) {
					if (Game.score >= this.cost[index]) {
							Game.score -= this.cost[index];
							this.count[index]++;
							this.cost[index] = Math.ceil(this.cost[index] * 1.10);
							display.updateScore();
							display.updateShop();
					}
				}
			};
			
			
			
			var display = {
				updateScore: function() {
					document.getElementById("score").innerHTML = Game.score;
					document.getElementById("SPS").innerHTML = Game.getSPS();
					document.title = Game.score + " A - A Clicker";
				},
				
				updateShop: function() {
					document.getElementById("shopContainer").innerHTML = "";
					for (i = 0; i < building.name.length; i++) {
						document.getElementById("shopContainer").innerHTML += '<table class="shopButton" onclick="building.purchase('+i+')"><td id="image"><img src="images/'+building.image[i]+'"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> A</p></td><td id="amount"><span>'+building.count[i]+'</span></td></table>'
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
					buildingCost: building.cost
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
				}
			}
			
			function ResetGame() {
				if (confirm("Do you want to reset everything in the game")) {
					var GameSave = {};
					localStorage.setItem("GameSave", JSON.stringify(GameSave));
					location.reload();
				}
			}
			setInterval(function() {
				saveGame()
			}, 15000);
			
			window.onload = function() {
				loadGame();
				display.updateScore();
				display.updateShop();
			};
			
			setInterval(function() {
				Game.score += Game.getSPS();
				Game.totalScore += Game.getSPS();
				display.updateScore();
			}, 1000);
			
			document.addEventListener("keydown", function(event) {
				if (event.ctrlKey && event.which == 83) {
					event.preventDefault();
					SaveGame();
				}
			}, false);