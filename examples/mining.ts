import { of, flatMap, map, Program } from '../state';

interface Purse {
  gold: number;
  silver: number;
}

type Tool = 'shovel' | 'pickaxe';

function mineGold(tool: Tool): Program<number, Purse> {
  return purse => {
    const { gold } = purse;
    const n = tool === 'pickaxe' ? 3 : 1;
    return [n, { ...purse, gold: gold + n }];
  };
}

function mineSilver(tool: Tool): Program<number, Purse> {
  return purse => {
    const { gold, silver } = purse;
    const n = tool === 'pickaxe' ? 3 : 2;
    return [n, { ...purse, silver: silver + n }];
  };
}

function grabTool(): Program<Tool, Purse> {
  return purse => ['pickaxe', purse];
}

const program = flatMap((tool: Tool): Program<number, Purse> => {
  const noOfGold = mineGold(tool);
  return flatMap(n => (n > 1 ? of(0) : mineSilver(tool)), noOfGold);
}, grabTool());

const purse = { gold: 0, silver: 0 };
const [, result] = program(purse);
console.log('purse: %j', result);
