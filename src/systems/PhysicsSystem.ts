import { ECS, System } from "../ecs";
import { physicsWorld } from "../physics";

export const PhysicsSystem = (ecs: ECS): System => ({
	query: {},
	handler() {
		// TODO: Handle catchup etc.
		physicsWorld.step(1 / 60);
	},
});
