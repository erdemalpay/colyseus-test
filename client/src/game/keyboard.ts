import Phaser from "phaser";

export enum KeyboardAction {
  Left = "left",
  Up = "up",
  Right = "right",
  Down = "down",
}

export interface KeyboardKey {
  instance: Phaser.Input.Keyboard.Key;
  action: KeyboardAction;
}

export class Keyboard {
  keys: KeyboardKey[] = [];

  constructor(private scene: Phaser.Scene) {
    this.registerKeys();
  }

  registerKeys() {
    const keyboardKeys = [
      {
        instance: this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.LEFT,
          false
        ),
        action: KeyboardAction.Left,
      },
      {
        instance: this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.UP,
          false
        ),
        action: KeyboardAction.Up,
      },
      {
        instance: this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.RIGHT,
          false
        ),
        action: KeyboardAction.Right,
      },
      {
        instance: this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.DOWN,
          false
        ),
        action: KeyboardAction.Down,
      },
    ];

    this.keys = keyboardKeys;
  }

  getActiveActions() {
    return this.keys
      .filter((key) => key.instance.isDown)
      .map((key) => key.action);
  }
}
