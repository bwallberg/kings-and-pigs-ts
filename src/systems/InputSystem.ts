import { Vec2 } from "planck";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { EntityType } from "../constants";
import { ECS, Entity, System } from "../ecs";
import { isEntityTypeInContact } from "../physics";

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
		const physics = ecs?.get(player, PhysicsComponent);
		if (physics) {
			let x = 0,
				y;
			[
				{ key: "ArrowLeft", x: -50 },
				{ key: "ArrowRight", x: 50 },
			].forEach((input) => {
				if (pressed.get(input.key)) {
					x += input.x || 0;
				}
			});

			if (
				pressed.get("Space") &&
				physics.body.getContactList() &&
				isEntityTypeInContact(physics.body.getContactList()!, EntityType.GROUND)
			) {
				y = -20;
				physics.body.applyLinearImpulse(new Vec2(0, y), physics.body.getWorldCenter());
			}

			physics.setVelocity(x, y);
		}
	},
});
