import { BodyComponent } from "./components";
import { Entity, init } from "./ecs";
import { InputSystem } from "./systems/InputSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";
import { DebugRenderSystem } from "./systems/DebugRenderSystem";

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
	}
	requestAnimationFrame(loop);
}

function main() {
	const ecs = init();

	const player = ecs.create();

	ecs.emplace(player, new BodyComponent(10, 10, 10, 10));

	game.player = player;

	ecs?.register(InputSystem(ecs, player));
	ecs?.register(PhysicsSystem(ecs));
	ecs.register(DebugRenderSystem(ecs));

	start(ecs);
}

window.onload = main;
