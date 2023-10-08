import { ECS, Entity, System } from "../ecs";
import { PhysicsComponent } from "../components/PhysicsComponent";

const CORD_SIZE = 2;

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
			const body = ecs?.get(entity, PhysicsComponent);

			if (body) {
				const { x, y } = body.position;
				const vertices = body.shape?.m_vertices;

				if (vertices) {
					context.strokeStyle = "rgba(255, 0, 0, 0.5)";
					context.beginPath();
					context.moveTo(x + vertices[0].x, y + vertices[0].y);

					for (let i = 1; i < vertices.length; i++) {
						context.lineTo(x + vertices[i].x, y + vertices[i].y);
					}

					context.closePath();
					context.stroke();
				}

				context.fillStyle = "rgb(0, 0, 0)";
				context.fillRect(
					x - CORD_SIZE / 2,
					y - CORD_SIZE / 2,
					CORD_SIZE,
					CORD_SIZE,
				);
			}
		});
	},
});
