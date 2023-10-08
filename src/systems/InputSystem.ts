import { ECS, Entity, System } from "../ecs";
import {
	MovementComponent,
	MovementDirection,
} from "../components/MovementComponent";
import { MovementState } from "../components/MovementComponent";

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
		const movement = ecs?.get(player, MovementComponent);
		if (movement) {
			if (pressed.get("ArrowLeft")) {
				movement.direction = MovementDirection.LEFT;
			} else if (pressed.get("ArrowRight")) {
				movement.direction = MovementDirection.RIGHT;
			} else {
				movement.direction = MovementDirection.IDLE;
			}

			if (pressed.get("Space") && movement.state === MovementState.STANDING) {
				movement.state = MovementState.JUMPING;
			}
		}
	},
});
