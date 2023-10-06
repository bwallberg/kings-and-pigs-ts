export type Entity = string;

export abstract class Component {
	public abstract destroy();
}

export interface System {
	query: {
		// TODO: implement a way to select which components are of interest for the system
		// types?: string[],
		entities?: Entity[];
	};
	handler: (entities: Entity[]) => void;
}

type ComponentClass<T extends Component> = new (...args: any[]) => T;

export function init() {
	const registry: Entity[] = [];
	const components: Map<Entity, Map<Function, Component>> = new Map();
	const systems: System[] = [];
	return {
		create: () => {
			const entity: Entity = crypto.randomUUID();
			registry.push(entity);
			components.set(entity, new Map());
			return entity;
		},
		delete: (entity: Entity) => {
			const index = registry.indexOf(entity);
			if (index > -1) {
				registry.splice(index, 1);
				components.get(entity)?.forEach((component) => {
					component.destroy();
				});
				components.delete(entity);
			}
		},
		emplace(entity: Entity, component: Component) {
			const entityComponents = components.get(entity);
			entityComponents?.set(component.constructor, component);
		},
		// TODO: ?
		// registerInputSystem()
		// registerUpdateSystem()
		// registerRenderSystem()
		register(system: System) {
			systems.push(system);
		},
		get<T extends Component>(
			entity: Entity,
			componentClass: ComponentClass<T>,
		) {
			return components.get(entity)?.get(componentClass) as T | undefined;
		},
		tick() {
			// TODO: implement three different ticks, input, update, and render that run at different times.
			// eg. input always runs, update sometimes runs, and render always runs but provides a time to the render system to adjust for lag.
			systems.forEach(({ query, handler }) => {
				if (query.entities) {
					handler(query.entities);
				} else {
					handler(registry);
				}
			});
		},
	};
}

export type ECS = ReturnType<typeof init>;
