import { Component } from "../ecs";

export class HealthComponent extends Component {
	constructor(public health: number = 100) { super() }

	public destroy() {}
}