import { COURSES, findLessonsForCourse } from './../../../../server/db-data';
import { TestBed } from '@angular/core/testing';
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {

	let coursesService: CoursesService;
	let httpClientTestingController: HttpTestingController;

	beforeEach(() => {

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				CoursesService,

			]
		});

		coursesService = TestBed.inject(CoursesService);
		httpClientTestingController = TestBed.inject(HttpTestingController);
	});

	it('should retrive all courses', () => {
		coursesService.findAllCourses().subscribe(courses => {

			expect(courses).toBeTruthy('No courses returned');

			expect(courses.length).toBe(12, 'Incorrect number of courses');

			const course = courses.find(courses => courses.id === 12);

			expect(course.titles.description).toBe('Angular Testing Course');
		});

		const req = httpClientTestingController.expectOne('/api/courses');

		expect(req.request.method).toEqual('GET');
		req.flush({
			payload: Object.values(COURSES)
		});
	});

	it('should find a course by id', () => {
		coursesService.findCourseById(12).subscribe(course => {

			expect(course).toBeTruthy('No course returned');

			expect(course.id).toBe(12, 'Incorrect course`s id');
		});

		const req = httpClientTestingController.expectOne('/api/courses/12');

		expect(req.request.method).toEqual('GET');
		req.flush(COURSES[12]);
	});

	it('should save the course data', () => {
		const newCoursesData: Partial<Course> = {
			titles: {
				description: 'Testing Course'
			}
		};
		coursesService.saveCourse(12, newCoursesData).subscribe(course => {
			expect(course).toBeTruthy('No course editted');

			expect(course.id).toBe(12);
		});

		const req = httpClientTestingController.expectOne('/api/courses/12');

		expect(req.request.method).toEqual('PUT');
		expect(req.request.body.titles.description).toEqual(newCoursesData.titles.description);

		req.flush({
			...COURSES[12],
			...newCoursesData
		});
	});

	it('should give an error if save course fails', () => {
		const newCoursesData: Partial<Course> = {
			titles: {
				description: 'Testing Course'
			}
		};
		coursesService.saveCourse(12, newCoursesData).subscribe(
			() => fail('The save course operation should have failed'),
			(error: HttpErrorResponse) => {
				expect(error.status).toBe(500);
			});

		const req = httpClientTestingController.expectOne('/api/courses/12');

		expect(req.request.method).toEqual('PUT');

		req.flush('Save course failed', { status: 500, statusText: 'Internal Server Error' });
	});

	it('should find a list of lessons', () => {
		coursesService.findLessons(12).subscribe(lessons => {
			expect(lessons).toBeTruthy();
			expect(lessons.length).toBe(3);
		});

		const req = httpClientTestingController.expectOne(req => req.url == '/api/lessons');

		expect(req.request.method).toEqual('GET');
		expect(req.request.params.get('courseId')).toEqual('12');
		expect(req.request.params.get('filter')).toEqual('');
		expect(req.request.params.get('sortOrder')).toEqual('asc');
		expect(req.request.params.get('pageNumber')).toEqual('0');
		expect(req.request.params.get('pageSize')).toEqual('3');

		req.flush({
			payload: findLessonsForCourse(12).slice(0, 3)
		});
	});

	afterEach(() => {
		httpClientTestingController.verify();
	});
});