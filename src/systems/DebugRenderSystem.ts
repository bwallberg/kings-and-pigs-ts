import { BodyComponent } from "../components";
import { ECS, Entity, System } from "../ecs";

export const DebugRenderSystem = (ecs: ECS): System => ({
	query: {},
	handler: (entities: Entity[]) => {
		const canvas = document.querySelector<HTMLCanvasElement>("canvas");
		const context = canvas?.getContext("2d");
		if (!canvas || !context) {
			return;
		}

		context.clearRect(0, 0, canvas?.width, canvas?.height);

		entities.forEach((entity) => {
			const body = ecs?.get(entity, BodyComponent);

			if (body) {
				context.fillStyle = 'rgba(255, 0, 0, 0.8)';
				context.fillRect(body.x + (body.width / 2), body.y + (body.height / 2), body.width, body.height);
			}
		});
	},
});
