import { PhysicsComponent } from "../components/PhysicsComponent";
import { EntityType } from "../constants";
import { ECS, Entity, System } from "../ecs";
import { isEntityTypeInContact } from "../physics";

export const FallingRocksSystem = (ecs: ECS, rocks: Entity[]): System => ({
	query: {
		entities: rocks,
	},
	handler: (rocks: Entity[]) => {
		rocks.forEach((rock) => {
			const physics = ecs?.get(rock, PhysicsComponent);
			if (
				physics &&
				isEntityTypeInContact(physics.body.getContactList()!, EntityType.GROUND)
			) {
				ecs.delete(rock);
			}
		});
	},
});
