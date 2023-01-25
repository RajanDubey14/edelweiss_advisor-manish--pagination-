import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-pledge',
  templateUrl: './pledge.component.html',
  styleUrls: ['./pledge.component.css'],
})
export class PledgeComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authservice: AuthServiceService
  ) {}

  ngOnInit(): void {}
}
