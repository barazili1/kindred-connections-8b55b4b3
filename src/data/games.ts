import i_appleOfFortune from "@/assets/g/apple-of-fortune.png.asset.json";
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

export type GameCategory = "instant";

export type Game = {
  name: string;
  image: string;
  category: GameCategory;
};

export const games: Game[] = [
  { name: "Scratch Card", image: "/img/i/scratch-card.jpg", category: "instant" },
  { name: "Fruit Cocktail", image: "/img/i/fruit-cocktail.jpg", category: "instant" },
  { name: "Royal Crystals", image: "/img/i/royal-crystals.jpg", category: "instant" },
  { name: "Diamond Slots", image: "/img/i/diamond-slots.jpg", category: "instant" },
  { name: "Royal Feast", image: "/img/i/royal-feast.jpg", category: "instant" },
  { name: "Book of Ra", image: "/img/i/book-of-ra.jpg", category: "instant" },
  { name: "Swirly Spin", image: "/img/i/swirly-spin.jpg", category: "instant" },
  { name: "Wild Fruits", image: "/img/i/wild-fruits.jpg", category: "instant" },
  { name: "Yahtzee", image: "/img/i/yahtzee.jpg", category: "instant" },
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
