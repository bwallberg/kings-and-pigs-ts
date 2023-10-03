import { Component } from "../ecs";
import { Body, FixtureOpt, PolygonShape, Shape, Vec2 } from "planck";
import { physicsWorld } from "../physics";

export class BodyComponent extends Component {
	private body: Body;

	constructor(
		position: Vec2,
		shape: Shape,
		fixtureOpt: FixtureOpt = {
			density: 1,
			friction: 0.3,
		},
	) {
		super();

		this.body = physicsWorld.createBody({
			type: "dynamic",
			position,
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

	isTouching() {
		return this.body.getContactList()?.contact.isTouching();
	}

	setVelocity(x?: number, y?: number) {
		const velocity = this.body.getLinearVelocity();
		if (x !== undefined) {
			velocity.x = x * 50;
		}
		if (y !== undefined) {
			velocity.y = y * 50;
		}
		this.body.setLinearVelocity(velocity);
	}
}
