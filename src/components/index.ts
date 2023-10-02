import { Component } from "../ecs";
import { physicsWorld } from "../systems/PhysicsSystem";
import { Body, Box, PolygonShape, Vec2 } from "planck";

export class BodyComponent extends Component {
	private body: Body;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		super();

		this.body = physicsWorld.createBody({
			type: "dynamic",
			position: new Vec2(x, y),
		});

		this.body.createFixture({
			shape: new Box(width, height),
			density: 1,
			friction: 0.3,
		});
		(window as any).bwallberg = this.body;
	}

	get x() {
		return this.body.getPosition().x 
	}

	get y() {
		return this.body.getPosition().y;
	}

	get width() {
		const shape = this.body.getFixtureList()?.getShape() as PolygonShape;

		const [topRight, bottomRight, topLeft, bottomLeft] = shape.m_vertices;

		// @ts-ignore
		return Math.abs(topLeft.x) + topRight.x;
	}

	get height() {
		const shape = this.body.getFixtureList()?.getShape() as PolygonShape;

		const [topRight, bottomRight, topLeft, bottomLeft] = shape.m_vertices;

		// @ts-ignore
		return Math.abs(topRight.y) + bottomRight.y;
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
			console.log("bwallberg", velocity.y);
		}
		this.body.setLinearVelocity(velocity);	
	}
}
