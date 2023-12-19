import { Book } from "@/database/entities/book.entity";
import { wrap } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { BookRepository } from "@/database/repositories/book.repository";

@Injectable()
export class BookService {
  constructor(
  @InjectRepository(Book) 
  private readonly bookRepository: BookRepository) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    console.log(createBookDto); // Выведите в консоль переданный DTO
    const book = this.bookRepository.create(createBookDto);
  
    await this.bookRepository.persistAndFlush(book);
  
    return book;
  }
  

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async findOne(id: string): Promise<Book> {
    return this.bookRepository.findOneOrFail(id);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOneOrFail(id);
    wrap(book).assign(updateBookDto);
    await this.bookRepository.flush();
    return book;
  }

  async remove(id: string): Promise<void> {
    const book = await this.bookRepository.findOneOrFail(id);
    await this.bookRepository.removeAndFlush(book);
  }
}
