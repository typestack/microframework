import {Controller, Get, Post, Put, Delete, Param, Body} from "type-controllers/Annotations";
import {Resolve} from "typedi/Resolve"
import {Response} from "express";
import {Request} from "express";
import {QuestionRepository} from "../repository/QuestionRepository";
import {Question} from "../document/Question";

@Resolve()
@Controller()
export class QuestionController {

	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------

	constructor(private questionRepository: QuestionRepository) { }

	// -------------------------------------------------------------------------
	// Controller Actions
	// -------------------------------------------------------------------------

	@Get('/questions')
	all(request: Request, response: Response): Promise<Question[]> {
		return this.questionRepository.findAll();
	}

	@Get('/questions/:id')
	one(request: Request, response: Response, @Param('id') id: string): Promise<Question> {
		return this.questionRepository.findById(id);
	}

	@Post('/questions')
	@Put('/questions/:id')
	save(request: Request, response: Response, @Body() question: Question): Promise<Question> {
		return this.questionRepository.save(question);
	}

	@Delete('/questions/:id')
	remove(request: Request, response: Response, @Param('id') id: string): Promise<void> {
		return this.questionRepository.removeById(id);
	}

}
