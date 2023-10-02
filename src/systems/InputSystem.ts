import { BodyComponent } from "../components";
import { ECS, Entity, System } from "../ecs";

const pressed = new Map<string, boolean>();

document.addEventListener("keydown", (evt) => {
	pressed.set(evt.code, true);
});

document.addEventListener("keyup", (evt) => {
	pressed.set(evt.code, false);
});

export const InputSystem = (ecs: ECS, player: Entity): System => ({
	query: {
		entities: player ? [player] : [],
	},
	handler: ([player]: Entity[]) => {
		const body = ecs?.get(player, BodyComponent);
		if (body) {
			let x = 0, y;
			[
				{ key: "ArrowLeft", x: -1 },
				{ key: "ArrowRight", x: 1 },
			].forEach((input) => {
				if (pressed.get(input.key)) {
					x += input.x || 0;
				}
			});


			if (pressed.get('Space') && body.isTouching()) {
				y = -50;
			}

			body.setVelocity(x, y);
		}
	},
});

