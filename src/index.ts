import { ECS, Entity, init } from "./ecs";
import { InputSystem } from "./systems/InputSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";
import { DebugRenderSystem } from "./systems/DebugRenderSystem";
import { createWorldEdges } from "./physics";
import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "./components/PhysicsComponent";
import { EntityType } from "./constants";
import { FallingRocksSystem } from "./systems/FallingRocksSystem";
import { HealthComponent } from "./components/HealthComponent";
import { AnimatedSpriteComponent } from "./components/AnimatedSpriteComponent";
import { RenderSystem } from "./systems/RenderSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { MovementComponent } from "./components/MovementComponent";
import { PreRenderSystem } from "./systems/PreRenderSystem";
import { Sprite } from "./gfx/AnimatedSprite";

import playerIdleSprite from "../public/assets/knight/idle.png";
import { AnimateSpriteSystem } from "./systems/AnimateSpriteSystem";

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

function start(ecs: ECS) {
	const loop = () => {
		if (!game.player) {
			return;
		}

		ecs?.tick();

		const playerHealth = ecs.get(game.player, HealthComponent);
		if (playerHealth && playerHealth.health > 0) {
			requestAnimationFrame(loop);
		}
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
			position: new Vec2(5, 600),
			shape: new Box(10, 19),
		}),
	);
	ecs.emplace(player, new MovementComponent());
	ecs.emplace(player, new HealthComponent());
	ecs.emplace(
		player,
		new AnimatedSpriteComponent(
			new Sprite({
				url: playerIdleSprite,
				width: 120,
				height: 80,
				frames: 10,
				center: Vec2(55, 61),
			}),
		),
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

	ecs.register(InputSystem(ecs, player));

	ecs.register(MovementSystem(ecs));
	ecs.register(FallingRocksSystem(ecs, player));
	ecs.register(PhysicsSystem(ecs));

	ecs.register(AnimateSpriteSystem(ecs));

	ecs.register(PreRenderSystem());
	ecs.register(RenderSystem(ecs));
	ecs.register(DebugRenderSystem(ecs));

	start(ecs);
}

window.onload = main;
