import { Entity, init } from "./ecs";
import { InputSystem } from "./systems/InputSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";
import { DebugRenderSystem } from "./systems/DebugRenderSystem";
import { createWorldEdges } from "./physics";
import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "./components/PhysicsComponent";
import { EntityType } from "./constants";
import { FallingRocksSystem } from "./systems/FallingRocksSystem";

const canvas = document.querySelector("canvas");

if (!canvas) {
	throw "[Dungeon Survival] No canvas found!";
}

// TODO: move this...
export type Game = {
	ecs?: ReturnType<typeof init>;
	player?: Entity;

	width: number;
	height: number;
};

const game: Game = {
	width: canvas.width,
	height: canvas.height,
};

function start(ecs) {
	const loop = () => {
		ecs?.tick();
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
}

function main() {
	const ecs = init();

	createWorldEdges(game.width, game.height);

	const player = ecs.create();
	const rocks = new Array(20).fill(undefined).map(() => ecs.create());

	ecs.emplace(
		player,
		new PhysicsComponent({
			entityType: EntityType.PLAYER,
			position: new Vec2(5, 700),
			shape: new Box(8, 18),
		}),
	);
	rocks.forEach((rock, index) => {
		ecs.emplace(
			rock,
			new PhysicsComponent({
				entityType: EntityType.FALLING_ROCK,
				position: new Vec2(200 + index * 5, 5),
				shape: new Box(5, 5),
			}),
		);
	});

	game.player = player;

	ecs?.register(InputSystem(ecs, player));
	ecs?.register(FallingRocksSystem(ecs, rocks));
	ecs?.register(PhysicsSystem(ecs));
	ecs.register(DebugRenderSystem(ecs));

	start(ecs);
}

window.onload = main;
