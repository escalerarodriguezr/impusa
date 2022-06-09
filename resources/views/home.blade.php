@extends('layouts.app')

@section('title', 'Inicio')

@section('content')

    @include('inc.categories-section')
    @include('inc.card-category-template')
    @include('inc.add-card-category-modal')
    @include('inc.add-task-modal')

@endsection
