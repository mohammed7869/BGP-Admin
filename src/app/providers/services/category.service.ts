import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Category {
  id?: string;
  name: string;
  isActive: boolean;
  showOnHomePage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private collectionName = 'categories';

  constructor(private firestore: AngularFirestore) {}

  list(): Observable<Category[]> {
    return this.firestore.collection<Category>(this.collectionName).valueChanges({ idField: 'id' });
  }

  create(data: Category): Promise<any> {
    return this.firestore.collection<Category>(this.collectionName).add(data);
  }

  update(id: string, data: Partial<Category>): Promise<void> {
    return this.firestore.collection<Category>(this.collectionName).doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.firestore.collection<Category>(this.collectionName).doc(id).delete();
  }

  detail(id: string): Observable<Category | undefined> {
    return this.firestore.collection<Category>(this.collectionName).doc(id).valueChanges({ idField: 'id' });
  }
}

export interface SubCategory {
  id?: string;
  name: string;
  isActive: boolean;
  categoryId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private collectionName = 'sub-categories';

  constructor(private firestore: AngularFirestore) {}

  list(): Observable<SubCategory[]> {
    return this.firestore.collection<SubCategory>(this.collectionName).valueChanges({ idField: 'id' });
  }

  create(data: SubCategory): Promise<any> {
    return this.firestore.collection<SubCategory>(this.collectionName).add(data);
  }

  update(id: string, data: Partial<SubCategory>): Promise<void> {
    return this.firestore.collection<SubCategory>(this.collectionName).doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.firestore.collection<SubCategory>(this.collectionName).doc(id).delete();
  }

  detail(id: string): Observable<SubCategory | undefined> {
    return this.firestore.collection<SubCategory>(this.collectionName).doc(id).valueChanges({ idField: 'id' });
  }
} 