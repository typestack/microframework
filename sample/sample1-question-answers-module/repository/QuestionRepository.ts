import {Resolve} from "typedi/Resolve"
import {Repository} from "typeodm/repository/Repository";
import {Connection} from "typeodm/connection/Connection";
import {Question} from "../document/Question";
import {ConnectionManager} from "typeodm/connection/ConnectionManager";

@Resolve()
export class QuestionRepository {

	// -------------------------------------------------------------------------
	// Properties
	// -------------------------------------------------------------------------

	private repository: Repository<Question>;

	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------

	constructor(connectionManager: ConnectionManager) {
		this.repository = connectionManager.getConnection().getRepository<Question>(Question);
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
		return this.repository.persist(question);
	}

	removeById(id: string): Promise<void> {
		return this.repository.removeById(id);
	}

}
