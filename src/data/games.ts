import i_appleOfFortune from "@/assets/g/apple-of-fortune.png.asset.json";
import g_aviator from "@/assets/g/aviator.png.asset.json";
import g_spaceman from "@/assets/g/spaceman.png.asset.json";
import g_penaltyShootOutStreet from "@/assets/g/penalty-shoot-out-street.png.asset.json";
import g_doodleCrash from "@/assets/g/doodle-crash.png.asset.json";
import g_zeppelin from "@/assets/g/zeppelin.png.asset.json";
import g_toMarsAndBeyond from "@/assets/g/to-mars-and-beyond.png.asset.json";
import g_cricketCrash from "@/assets/g/cricket-crash.png.asset.json";
import g_saveTheHamster from "@/assets/g/save-the-hamster.png.asset.json";
import g_goblinRun from "@/assets/g/goblin-run.png.asset.json";
import g_quantumX from "@/assets/g/quantum-x.png.asset.json";
import g_highFlyer from "@/assets/g/high-flyer.png.asset.json";
import g_f777Fighter from "@/assets/g/f777-fighter.png.asset.json";
import g_mriya from "@/assets/g/mriya.png.asset.json";
import g_longBall from "@/assets/g/long-ball.png.asset.json";
import g_cricketBoom from "@/assets/g/cricket-boom.png.asset.json";
import g_cashOrCrash2 from "@/assets/g/cash-or-crash-2.png.asset.json";
import g_crashPuck from "@/assets/g/crash-puck.png.asset.json";
import g_crashTouchdown from "@/assets/g/crash-touchdown.png.asset.json";
import g_spaceBlaze from "@/assets/g/space-blaze.png.asset.json";
import g_cashItMultiplayer from "@/assets/g/cash-it-multiplayer.png.asset.json";
import g_cashOrCrash from "@/assets/g/cash-or-crash.png.asset.json";
import g_crashBirdsMultiplayer from "@/assets/g/crash-birds-multiplayer.png.asset.json";
import g_kickItMultiplayer from "@/assets/g/kick-it-multiplayer.png.asset.json";
import g_luckyCrumbling from "@/assets/g/lucky-crumbling.png.asset.json";
import g_crashHamsterCrash from "@/assets/g/crash-hamster-crash.png.asset.json";
import g_crashBirds from "@/assets/g/crash-birds.png.asset.json";
import g_fortuneTumble from "@/assets/g/fortune-tumble.png.asset.json";
import g_tripleCashOrCrash from "@/assets/g/triple-cash-or-crash.png.asset.json";
import g_cashGalaxy from "@/assets/g/cash-galaxy.png.asset.json";
import g_stormyWitch from "@/assets/g/stormy-witch.png.asset.json";
import g_needForX from "@/assets/g/need-for-x.png.asset.json";
import g_9CoinsEaster from "@/assets/g/9-coins-easter.png.asset.json";
import g_raiderJaneSCryptOfF from "@/assets/g/raider-jane-s-crypt-of-f.png.asset.json";
import g_bigBassCrash from "@/assets/g/big-bass-crash.png.asset.json";
import g_rocketRace from "@/assets/g/rocket-race.png.asset.json";
import g_monsterGoShopping from "@/assets/g/monster-go-shopping.png.asset.json";
import g_flyToUniverse from "@/assets/g/fly-to-universe.png.asset.json";
import g_deepRush from "@/assets/g/deep-rush.png.asset.json";
import g_skyLantern from "@/assets/g/sky-lantern.png.asset.json";
import g_doubleBubble from "@/assets/g/double-bubble.png.asset.json";
import g_fairCrash from "@/assets/g/fair-crash.png.asset.json";
import g_spaceXy from "@/assets/g/space-xy.png.asset.json";
import g_topEagle from "@/assets/g/top-eagle.png.asset.json";
import g_limboXy from "@/assets/g/limbo-xy.png.asset.json";
import g_giftX from "@/assets/g/gift-x.png.asset.json";
import g_dragonSCrash from "@/assets/g/dragon-s-crash.png.asset.json";
import g_arizonaSmithAndT from "@/assets/g/arizona-smith-and-t.png.asset.json";
import g_magnifyMan from "@/assets/g/magnify-man.png.asset.json";
import g_chickenRoad from "@/assets/g/chicken-road.png.asset.json";
import g_plinko from "@/assets/g/plinko.png.asset.json";
import g_chickenRoad20 from "@/assets/g/chicken-road-2-0.png.asset.json";
import g_hamsterRun from "@/assets/g/hamster-run.png.asset.json";
import g_luckyMines from "@/assets/g/lucky-mines.png.asset.json";
import g_tower from "@/assets/g/tower.png.asset.json";
import i_airCrash from "@/assets/i/air-crash.jpg.asset.json";
import i_777 from "@/assets/i/777.jpg.asset.json";
import i_thimbles from "@/assets/i/thimbles.jpg.asset.json";
import i_swampLand from "@/assets/i/swamp-land.jpg.asset.json";
import i_easternNights from "@/assets/i/eastern-nights.jpg.asset.json";
import i_gemsMines from "@/assets/i/gems-mines.jpg.asset.json";
import i_goal from "@/assets/i/goal.jpg.asset.json";
import i_dice from "@/assets/i/dice.jpg.asset.json";
import i_crash from "@/assets/i/crash.jpg.asset.json";
import i_crashPoint from "@/assets/i/crash-point.jpg.asset.json";
import i_vampireCurse from "@/assets/i/vampire-curse.jpg.asset.json";
import i_crystal from "@/assets/i/crystal.jpg.asset.json";
import i_burningHot from "@/assets/i/burning-hot.jpg.asset.json";

export type GameCategory = "casino" | "instant";

export type Game = {
  name: string;
  image: string;
  category: GameCategory;
};

export const games: Game[] = [
  { name: "Aviator", image: g_aviator.url, category: "casino" },
  { name: "Spaceman", image: g_spaceman.url, category: "casino" },
  { name: "Penalty Shoot-Out Street", image: g_penaltyShootOutStreet.url, category: "casino" },
  { name: "Doodle Crash", image: g_doodleCrash.url, category: "casino" },
  { name: "Zeppelin", image: g_zeppelin.url, category: "casino" },
  { name: "To Mars and Beyond", image: g_toMarsAndBeyond.url, category: "casino" },
  { name: "Cricket Crash", image: g_cricketCrash.url, category: "casino" },
  { name: "Save the Hamster", image: g_saveTheHamster.url, category: "casino" },
  { name: "Goblin Run", image: g_goblinRun.url, category: "casino" },
  { name: "Quantum X", image: g_quantumX.url, category: "casino" },
  { name: "High Flyer", image: g_highFlyer.url, category: "casino" },
  { name: "F777 Fighter", image: g_f777Fighter.url, category: "casino" },
  { name: "Mriya", image: g_mriya.url, category: "casino" },
  { name: "Long Ball", image: g_longBall.url, category: "casino" },
  { name: "Cricket Boom", image: g_cricketBoom.url, category: "casino" },
  { name: "Cash or Crash 2", image: g_cashOrCrash2.url, category: "casino" },
  { name: "Crash Puck", image: g_crashPuck.url, category: "casino" },
  { name: "Crash Touchdown", image: g_crashTouchdown.url, category: "casino" },
  { name: "Space Blaze", image: g_spaceBlaze.url, category: "casino" },
  { name: "Cash It Multiplayer", image: g_cashItMultiplayer.url, category: "casino" },
  { name: "Cash or Crash", image: g_cashOrCrash.url, category: "casino" },
  { name: "Crash Birds Multiplayer", image: g_crashBirdsMultiplayer.url, category: "casino" },
  { name: "Kick It Multiplayer", image: g_kickItMultiplayer.url, category: "casino" },
  { name: "Lucky Crumbling", image: g_luckyCrumbling.url, category: "casino" },
  { name: "Crash, Hamster, Crash!", image: g_crashHamsterCrash.url, category: "casino" },
  { name: "Crash Birds", image: g_crashBirds.url, category: "casino" },
  { name: "Fortune Tumble", image: g_fortuneTumble.url, category: "casino" },
  { name: "Triple Cash Or Crash", image: g_tripleCashOrCrash.url, category: "casino" },
  { name: "Cash Galaxy", image: g_cashGalaxy.url, category: "casino" },
  { name: "Stormy Witch", image: g_stormyWitch.url, category: "casino" },
  { name: "Need for X", image: g_needForX.url, category: "casino" },
  { name: "9 Coins Easter", image: g_9CoinsEaster.url, category: "casino" },
  { name: "Raider Jane's Crypt of Fortune", image: g_raiderJaneSCryptOfF.url, category: "casino" },
  { name: "Big Bass Crash", image: g_bigBassCrash.url, category: "casino" },
  { name: "Rocket Race", image: g_rocketRace.url, category: "casino" },
  { name: "Monster Go Shopping", image: g_monsterGoShopping.url, category: "casino" },
  { name: "Fly To Universe", image: g_flyToUniverse.url, category: "casino" },
  { name: "Deep Rush", image: g_deepRush.url, category: "casino" },
  { name: "Sky Lantern", image: g_skyLantern.url, category: "casino" },
  { name: "Double Bubble", image: g_doubleBubble.url, category: "casino" },
  { name: "Fair Crash", image: g_fairCrash.url, category: "casino" },
  { name: "Space XY", image: g_spaceXy.url, category: "casino" },
  { name: "Top Eagle", image: g_topEagle.url, category: "casino" },
  { name: "Limbo XY", image: g_limboXy.url, category: "casino" },
  { name: "Gift X", image: g_giftX.url, category: "casino" },
  { name: "Dragon's Crash", image: g_dragonSCrash.url, category: "casino" },
  { name: "Arizona Smith and the Mayan Treasure", image: g_arizonaSmithAndT.url, category: "casino" },
  { name: "Magnify Man", image: g_magnifyMan.url, category: "casino" },
  { name: "Chicken Road", image: g_chickenRoad.url, category: "casino" },
  { name: "Plinko", image: g_plinko.url, category: "casino" },
  { name: "Chicken Road 2.0", image: g_chickenRoad20.url, category: "casino" },
  { name: "Hamster Run", image: g_hamsterRun.url, category: "casino" },
  { name: "Lucky Mines", image: g_luckyMines.url, category: "casino" },
  { name: "Tower", image: g_tower.url, category: "casino" },
  { name: "Apple of Fortune", image: i_appleOfFortune.url, category: "instant" },
  { name: "Air Crash", image: i_airCrash.url, category: "instant" },
  { name: "777", image: i_777.url, category: "instant" },
  { name: "Thimbles", image: i_thimbles.url, category: "instant" },
  { name: "Swamp Land", image: i_swampLand.url, category: "instant" },
  { name: "Eastern Nights", image: i_easternNights.url, category: "instant" },
  { name: "Gems & Mines", image: i_gemsMines.url, category: "instant" },
  { name: "Goal!", image: i_goal.url, category: "instant" },
  { name: "Dice", image: i_dice.url, category: "instant" },
  { name: "Crash", image: i_crash.url, category: "instant" },
  { name: "Crash Point", image: i_crashPoint.url, category: "instant" },
  { name: "Vampire Curse", image: i_vampireCurse.url, category: "instant" },
  { name: "Crystal", image: i_crystal.url, category: "instant" },
  { name: "Burning Hot", image: i_burningHot.url, category: "instant" },
];
