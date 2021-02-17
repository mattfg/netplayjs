// import {
//   NetplayState,
//   NetplayInput,
//   NetplayPlayer,
//   JSONValue,
// } from "netplayjs";
// import { GameType } from "netplayjs";
// import { assert } from "chai";

// const PONG_WIDTH = 600;
// const PONG_HEIGHT = 300;

// const PADDLE_WIDTH = 10;
// const PADDLE_HEIGHT = 100;

// const LEFT_PADDLE_X = 0 + 100;
// const RIGHT_PADDLE_X = PONG_WIDTH - 100 - PADDLE_WIDTH;

// const BALL_WIDTH = 10;
// const BALL_HEIGHT = 10;

// const PADDLE_MOVE_SPEED = 5;
// const BALL_MOVE_SPEED = 5;

// function clamp(value: number, min: number, max: number): number {
//   return Math.min(Math.max(value, min), max);
// }

// function rectOverlap(
//   aLeft: number,
//   aRight: number,
//   aTop: number,
//   aBottom: number,
//   bLeft: number,
//   bRight: number,
//   bTop: number,
//   bBottom: number
// ) {
//   return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
// }

// export class PongState extends NetplayState<PongState, PongInput> {
//   leftPaddle: number = PONG_HEIGHT / 2 - PADDLE_HEIGHT / 2;
//   rightPaddle: number = PONG_HEIGHT / 2 - PADDLE_HEIGHT / 2;

//   ballPosition: [number, number] = [
//     PONG_WIDTH / 2 - BALL_WIDTH / 2,
//     PONG_HEIGHT / 2 - BALL_HEIGHT / 2,
//   ];
//   ballVelocity: [number, number] = [BALL_MOVE_SPEED, 0];

//   leftScore: number = 0;
//   rightScore: number = 0;

//   tick(playerInputs: Map<NetplayPlayer, PongInput>): void {
//     // Move paddles up and down.
//     for (const [player, input] of playerInputs.entries()) {
//       if (player.getID() == 0) {
//         this.leftPaddle += input.direction * PADDLE_MOVE_SPEED;
//       } else if (player.getID() == 1) {
//         this.rightPaddle += input.direction * PADDLE_MOVE_SPEED;
//       }
//     }

//     // Clamp paddles onto the screen.
//     this.leftPaddle = clamp(this.leftPaddle, 0, PONG_HEIGHT - PADDLE_HEIGHT);
//     this.rightPaddle = clamp(this.rightPaddle, 0, PONG_HEIGHT - PADDLE_HEIGHT);

//     // Apply ball velocity.
//     this.ballPosition[0] += this.ballVelocity[0];
//     this.ballPosition[1] += this.ballVelocity[1];

//     // Bounce ball on bottom / top of screen.
//     if (this.ballPosition[1] < 0) {
//       this.ballPosition[1] = 0;
//       this.ballVelocity[1] = -this.ballVelocity[1];
//     }
//     if (this.ballPosition[1] > PONG_HEIGHT - BALL_HEIGHT) {
//       this.ballPosition[1] = PONG_HEIGHT - BALL_HEIGHT;
//       this.ballVelocity[1] = -this.ballVelocity[1];
//     }

//     if (
//       rectOverlap(
//         this.ballPosition[0],
//         this.ballPosition[0] + BALL_WIDTH,
//         this.ballPosition[1],
//         this.ballPosition[1] + BALL_HEIGHT,
//         LEFT_PADDLE_X,
//         LEFT_PADDLE_X + PADDLE_WIDTH,
//         this.leftPaddle,
//         this.leftPaddle + PADDLE_HEIGHT
//       )
//     ) {
//       let offset =
//         (this.ballPosition[1] +
//           BALL_HEIGHT / 2 -
//           (this.leftPaddle + PADDLE_HEIGHT / 2)) /
//         PADDLE_HEIGHT;

//       this.ballVelocity[0] = -this.ballVelocity[0];
//       this.ballVelocity[1] = BALL_MOVE_SPEED * Math.sin(2 * offset);
//       this.ballPosition[0] = LEFT_PADDLE_X + PADDLE_WIDTH;
//     }

//     if (
//       rectOverlap(
//         this.ballPosition[0],
//         this.ballPosition[0] + BALL_WIDTH,
//         this.ballPosition[1],
//         this.ballPosition[1] + BALL_HEIGHT,
//         RIGHT_PADDLE_X,
//         RIGHT_PADDLE_X + PADDLE_WIDTH,
//         this.rightPaddle,
//         this.rightPaddle + PADDLE_HEIGHT
//       )
//     ) {
//       let offset =
//         (this.ballPosition[1] +
//           BALL_HEIGHT / 2 -
//           (this.rightPaddle + PADDLE_HEIGHT / 2)) /
//         PADDLE_HEIGHT;

//       this.ballVelocity[0] = -this.ballVelocity[0];
//       this.ballVelocity[1] = BALL_MOVE_SPEED * Math.sin(2 * offset);
//       this.ballPosition[0] = RIGHT_PADDLE_X - BALL_WIDTH;
//     }

//     if (this.ballPosition[0] > PONG_WIDTH) {
//       this.leftScore += 1;
//       this.ballPosition = [
//         PONG_WIDTH / 2 - BALL_WIDTH / 2,
//         PONG_HEIGHT / 2 - BALL_HEIGHT / 2,
//       ];
//       this.ballVelocity = [-BALL_MOVE_SPEED, 0];
//     }
//     if (this.ballPosition[0] < -BALL_HEIGHT) {
//       this.rightScore += 1;
//       this.ballPosition = [
//         PONG_WIDTH / 2 - BALL_WIDTH / 2,
//         PONG_HEIGHT / 2 - BALL_HEIGHT / 2,
//       ];
//       this.ballVelocity = [BALL_MOVE_SPEED, 0];
//     }
//   }

//   draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Draw paddles.
//     ctx.fillStyle = "white";
//     ctx.fillRect(LEFT_PADDLE_X, this.leftPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);
//     ctx.fillStyle = "white";
//     ctx.fillRect(RIGHT_PADDLE_X, this.rightPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);

//     // Draw ball.
//     ctx.fillStyle = "white";
//     ctx.fillRect(
//       this.ballPosition[0],
//       this.ballPosition[1],
//       BALL_WIDTH,
//       BALL_HEIGHT
//     );

//     // Draw scores.
//     ctx.font = "40px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(
//       this.leftScore.toString(),
//       PONG_WIDTH * 0.3,
//       PONG_HEIGHT * 0.2
//     );
//     ctx.fillText(
//       this.rightScore.toString(),
//       PONG_WIDTH * 0.7,
//       PONG_HEIGHT * 0.2
//     );
//   }
// }

// export class PongInput extends NetplayInput<PongInput> {
//   direction: 1 | 0 | -1 = 0;
// }

// export var PongGameType: GameType<PongState, PongInput> = {
//   timestep: 1000 / 60,

//   canvasWidth: PONG_WIDTH,
//   canvasHeight: PONG_HEIGHT,

//   constructInitialState(players: Array<NetplayPlayer>): PongState {
//     return new PongState();
//   },

//   constructDefaultInput(): PongInput {
//     return new PongInput();
//   },

//   draw(
//     state: PongState,
//     canvas: HTMLCanvasElement,
//     ctx: CanvasRenderingContext2D
//   ) {
//     state.draw(canvas, ctx);
//   },

//   getInputReader(document, canvas): () => PongInput {
//     const PRESSED_KEYS = {};
//     document.addEventListener(
//       "keydown",
//       (event) => {
//         PRESSED_KEYS[event.keyCode] = true;
//       },
//       false
//     );
//     document.addEventListener(
//       "keyup",
//       (event) => {
//         PRESSED_KEYS[event.keyCode] = false;
//       },
//       false
//     );

//     const TOUCH = { x: 0, y: 0, down: false };
//     canvas.addEventListener(
//       "touchstart",
//       function (e) {
//         const rect = canvas.getBoundingClientRect();
//         TOUCH.x = e.touches[0].clientX - rect.left;
//         TOUCH.y = e.touches[0].clientY - rect.top;
//         TOUCH.down = true;
//       },
//       false
//     );
//     canvas.addEventListener(
//       "touchend",
//       function (e) {
//         TOUCH.down = false;
//       },
//       false
//     );
//     canvas.addEventListener(
//       "touchmove",
//       function (e) {
//         const rect = canvas.getBoundingClientRect();
//         TOUCH.x = e.touches[0].clientX - rect.left;
//         TOUCH.y = e.touches[0].clientY - rect.top;
//       },
//       false
//     );

//     return () => {
//       let input = new PongInput();
//       if (PRESSED_KEYS[38] || (TOUCH.down && TOUCH.y < PONG_HEIGHT / 2))
//         input.direction = 1;
//       if (PRESSED_KEYS[40] || (TOUCH.down && TOUCH.y > PONG_HEIGHT / 2))
//         input.direction = -1;
//       return input;
//     };
//   },
// };
