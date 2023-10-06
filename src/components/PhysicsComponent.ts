import { Component } from "../ecs";
import { Body, BodyType, FixtureOpt, PolygonShape, Shape, Vec2 } from "planck";
import { physicsWorld } from "../physics";
import { EntityType } from "../constants";

export class PhysicsComponent extends Component {
	public body: Body;

	constructor({
		entityType,
		bodyType = "dynamic",
		position,
		shape,
		fixtureOpt = { friction: 1 },
	}: {
		entityType: typeof EntityType[keyof typeof EntityType];
		bodyType?: BodyType;
		position: Vec2;
		shape: Shape;
		fixtureOpt?: FixtureOpt;
	}) {
		super();

		this.body = physicsWorld.createBody({
			type: bodyType,
			position,
			userData: entityType
		});

		this.body.createFixture({
			shape,
			...fixtureOpt,
		});
	}

	getPosition() {
		return this.body.getPosition();
	}

	getShape() {
		const shape = this.body.getFixtureList()?.getShape();
		if (shape) {
			if (shape.getType() === "polygon") {
				return shape as PolygonShape;
			}
		}
	}

	setVelocity(x?: number, y?: number) {
		const velocity = this.body.getLinearVelocity();
		if (x !== undefined) {
			velocity.x = x;
		}
		if (y !== undefined) {
			velocity.y = y;
		}
		this.body.setLinearVelocity(velocity);
	}

	public destroy() {
	  physicsWorld.destroyBody(this.body);
	}
}
