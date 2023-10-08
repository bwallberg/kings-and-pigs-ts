import { Component } from "../ecs";

export enum MovementDirection {
	IDLE = "idle",
	RIGHT = "right",
	LEFT = "left",
}

export enum MovementState {
	STANDING = "standing",
	FALLING = "falling",
	JUMPING = "jumping",
}

export class MovementComponent extends Component {
	public state: MovementState = MovementState.STANDING;
	public direction: MovementDirection = MovementDirection.RIGHT;

	constructor() {
		super();
	}
	public destroy() {}
}
