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

	public get shape() {
		const shape = this.body.getFixtureList()?.getShape();
		if (shape) {
			if (shape.getType() === "polygon") {
				return shape as PolygonShape;
			}
		}
	}

	public get position() {
		return this.body.getPosition();
	}

	public set position(position: Vec2) {
		this.body.setPosition(position);
	}

	public get velocity() {
		return this.body.getLinearVelocity();
	}

	public set velocity(velocity: Vec2) {
		this.body.setLinearVelocity(velocity);
	}

	public destroy() {
	  physicsWorld.destroyBody(this.body);
	}
}
