import { Matrix4 } from "noobgl-matrix";
import { Vector3 } from "noobgl-vector";

export default class Camera {
	constructor( fieldOfView, near, far, aspect ){

		this.fieldOfView = (fieldOfView * Math.PI / 180);

		this.near = near;

		this.far = far;

		this.aspect = aspect;

		this.position = new Vector3();

		this.target = new Vector3();

		this.up = new Vector3(0, 1, 0);

		this.matrix = new Matrix4();

		this.projectionMatrix = new Matrix4();

		this.viewMatrix = new Matrix4();

		this.viewProjectionMatrix = new Matrix4();

		return this;

	}
	setAspect( aspect ){

		this.aspect = aspect;

		return this;

	}
	update(){

		var zAxis = this.position.clone().subtract(this.target.x, this.target.y, this.target.z).normalize();
		var xAxis = this.up.clone().cross(zAxis.x, zAxis.y, zAxis.z).normalize();
		var yAxis = zAxis.clone().cross(xAxis.x, xAxis.y, xAxis.z).normalize();

		this.matrix.set([
			xAxis.x, xAxis.y, xAxis.z, 0,
			yAxis.x, yAxis.y, yAxis.z, 0,
			zAxis.x, zAxis.y, zAxis.z, 0,
			this.position.x, this.position.y, this.position.z, 1
		]);

		var factor = Math.tan((Math.PI * 0.5) - (this.fieldOfView * 0.5));

		var rangeInverted = 1 / (this.near - this.far);

		this.projectionMatrix = new Matrix4([
			factor / this.aspect, 0, 0, 0,
			0, factor, 0, 0,
			0, 0, (this.near + this.far) * rangeInverted, -1,
			0, 0, this.near * this.far * rangeInverted * 2, 0
		]);

		this.viewMatrix = this.matrix.clone().inverse();

		this.viewProjectionMatrix = this.projectionMatrix.clone().multiply(this.viewMatrix);

		return this;

	}
}