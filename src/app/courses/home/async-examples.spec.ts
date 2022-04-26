import { delay } from 'rxjs/operators';
import { fakeAsync, flush, tick, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
describe('Async testing Example', () => {
	it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {

		let test = false;

		setTimeout(() => {
			test = true;
			expect(test).toBeTruthy();
			done();
		}, 1000);

	});

	it('Asynchronous test example - setTimeout()', fakeAsync(() => {

		let test = false;

		setTimeout(() => {
			test = true;
		}, 1000);

		flush();
		expect(test).toBeTruthy();
	}));

	it('Asynchronous test example - plain Promise', fakeAsync(() => {

		let test = false;

		Promise.resolve().then(() => {
			test = true;
		});

		flushMicrotasks();

		expect(test).toBeTruthy();

	}));

	it('Asynchronous test example - Promise + setTimeout()', fakeAsync(() => {

		let counter = 0;

		Promise.resolve().then(() => {
			counter += 10;

			setTimeout(() => {
				counter += 1;
			}, 1000);
		});

		expect(counter).toBe(0);

		flushMicrotasks();

		expect(counter).toBe(10);

		flush();

		expect(counter).toBe(11);

	}));

	it('Asynchronous test example - Observables', fakeAsync(() => {

		let test = false;

		const test$ = of(test).pipe(delay(1000));

		test$.subscribe(() => {
			test = true;
		});

		tick(1000)

		expect(test).toBeTruthy();
	}));
});