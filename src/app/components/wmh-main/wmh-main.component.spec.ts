import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmhMainComponent } from './wmh-main.component';

describe('WmhMainComponent', () => {
  let component: WmhMainComponent;
  let fixture: ComponentFixture<WmhMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmhMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmhMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
