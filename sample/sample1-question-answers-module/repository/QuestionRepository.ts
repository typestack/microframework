import {Resolve} from "typedi/Resolve"
import {Config} from "t-configurator/Annotations"
import {OdmRepository} from "typeodm/annotation/OdmRepository";
import {Repository} from "typeodm/repository/Repository";
import {Connection} from "typeodm/connection/Connection";
import {Question} from "../document/Question";
import {ConnectionManager} from "typeodm/connection/ConnectionManager";
import {Validator} from "t-validator/Validator";

@Resolve()
export class QuestionRepository {

	// -------------------------------------------------------------------------
	// Properties
	// -------------------------------------------------------------------------

	private repository: Repository<Question>;
	private validator: Validator;
	private onPage: number;

	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------

	constructor(@OdmRepository(Question) repository: Repository<Question>,
				validator: Validator,
				@Config('onPage') onPage: number) {
		this.repository = repository;
		this.validator = validator;
		this.onPage = onPage;
	}

	// -------------------------------------------------------------------------
	// Public Methods
	// -------------------------------------------------------------------------

	findAll(): Promise<Question[]> {
		return this.repository.find();
	}

	findById(id: string): Promise<Question> {
		return this.repository.findById(id);
	}

	save(question: Question): Promise<Question> {
		let validationErrors = this.validator.validate(Question, question);
		if (validationErrors.length > 0)
			throw new Error('Validation error! ' + JSON.stringify(validationErrors));

		return this.repository.persist(question);
	}

	removeById(id: string): Promise<void> {
		return this.repository.removeById(id);
	}

}
