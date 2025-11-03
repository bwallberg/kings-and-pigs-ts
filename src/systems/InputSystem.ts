import { ECS, Entity, System, SystemDefaults } from "../ecs";
import { Action, ActionComponent } from "../components/ActionComponent";

// disable double-tap on iOS
document.ondblclick = function(e) {
    e.preventDefault();
}

const pressed = new Map<string, boolean>();

// Keyboard controls
document.addEventListener("keydown", (evt) => {
	pressed.set(evt.code, true);
});

document.addEventListener("keyup", (evt) => {
	pressed.set(evt.code, false);
});

// Gamepad controls
let joystickActive = false;
let joystickDirection = 0; // -1 for left, 0 for neutral, 1 for right

const joystickBase = document.querySelector(".joystick-base") as HTMLElement;
const joystickKnob = document.querySelector(".joystick-knob") as HTMLElement;
const jumpButton = document.querySelector(".jump-button") as HTMLElement;

// Joystick touch handling
if (joystickBase && joystickKnob) {
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let baseRect: DOMRect;

	const updateJoystickPosition = (clientX: number, clientY: number) => {
		if (!baseRect) return;

		const centerX = baseRect.left + baseRect.width / 2;
		const centerY = baseRect.top + baseRect.height / 2;
		
		const deltaX = clientX - centerX;
		const deltaY = clientY - centerY;
		
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		const maxDistance = baseRect.width / 2 - 20; // Leave some margin
		
		let knobX = deltaX;
		let knobY = deltaY;
		
		if (distance > maxDistance) {
			knobX = (deltaX / distance) * maxDistance;
			knobY = (deltaY / distance) * maxDistance;
		}
		
		joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
		
		// Update direction based on horizontal movement
		if (Math.abs(knobX) > 10) { // Dead zone
			joystickDirection = knobX > 0 ? 1 : -1;
			pressed.set("ArrowLeft", joystickDirection < 0);
			pressed.set("ArrowRight", joystickDirection > 0);
		} else {
			joystickDirection = 0;
			pressed.set("ArrowLeft", false);
			pressed.set("ArrowRight", false);
		}
	};

	const resetJoystick = () => {
		joystickKnob.style.transform = "translate(0px, 0px)";
		joystickDirection = 0;
		pressed.set("ArrowLeft", false);
		pressed.set("ArrowRight", false);
		isDragging = false;
	};

	// Touch events
	joystickBase.addEventListener("touchstart", (e) => {
		e.preventDefault();
		isDragging = true;
		baseRect = joystickBase.getBoundingClientRect();
		const touch = e.touches[0];
		startX = touch.clientX;
		startY = touch.clientY;
		updateJoystickPosition(touch.clientX, touch.clientY);
	});

	joystickBase.addEventListener("touchmove", (e) => {
		e.preventDefault();
		if (isDragging) {
			const touch = e.touches[0];
			updateJoystickPosition(touch.clientX, touch.clientY);
		}
	});

	joystickBase.addEventListener("touchend", (e) => {
		e.preventDefault();
		resetJoystick();
	});

	// Mouse events for desktop testing
	joystickBase.addEventListener("mousedown", (e) => {
		e.preventDefault();
		isDragging = true;
		baseRect = joystickBase.getBoundingClientRect();
		startX = e.clientX;
		startY = e.clientY;
		updateJoystickPosition(e.clientX, e.clientY);
	});

	document.addEventListener("mousemove", (e) => {
		if (isDragging) {
			updateJoystickPosition(e.clientX, e.clientY);
		}
	});

	document.addEventListener("mouseup", () => {
		if (isDragging) {
			resetJoystick();
		}
	});
}

// Jump button handling
if (jumpButton) {
	jumpButton.addEventListener("touchstart", (e) => {
		e.preventDefault();
		pressed.set("Space", true);
	});

	jumpButton.addEventListener("touchend", (e) => {
		e.preventDefault();
		pressed.set("Space", false);
	});

	// Mouse events for desktop testing
	jumpButton.addEventListener("mousedown", (e) => {
		e.preventDefault();
		pressed.set("Space", true);
	});

	jumpButton.addEventListener("mouseup", (e) => {
		e.preventDefault();
		pressed.set("Space", false);
	});
}

export const InputSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	query: {
		entities: player ? [player] : [],
	},
	handler: ([player]: Entity[]) => {
		const component = ecs?.get(player, ActionComponent);

		if (component) {
			const actions = [];
			if (pressed.get("ArrowLeft")) {
				actions.push(Action.LEFT);
			} else if (pressed.get("ArrowRight")) {
				actions.push(Action.RIGHT);
			}

			if (pressed.get("Space")) {
				actions.push(Action.JUMP);
			}
			component.actions = actions;
		}
	},
});
