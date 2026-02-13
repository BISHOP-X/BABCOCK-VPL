import type { Submission } from '@/types';

export const mockSubmissions: Submission[] = [
  // Alex Chen — Python Week 1 (submitted, graded)
  {
    id: 'sub-001',
    assignment_id: 'asg-py-w1',
    student_id: 'stu-001',
    code: `# Variables & Data Types - Alex Chen
age = 20
gpa = 3.75
name = "Alex Chen"
is_enrolled = True

print(f"Age: {age}")
print(f"GPA: {gpa}")
print(f"Name: {name}")
print(f"Enrolled: {is_enrolled}")`,
    language: 'python',
    output: 'Age: 20\nGPA: 3.75\nName: Alex Chen\nEnrolled: True',
    submitted_at: '2026-02-06T14:30:00Z',
  },
  // Alex Chen — Python Week 2 (submitted, graded)
  {
    id: 'sub-002',
    assignment_id: 'asg-py-w2',
    student_id: 'stu-001',
    code: `# Control Flow - Alex Chen
score = 78

if score >= 70:
    grade = "A"
elif score >= 60:
    grade = "B"
elif score >= 50:
    grade = "C"
elif score >= 45:
    grade = "D"
else:
    grade = "F"

print(f"Score: {score}")
print(f"Grade: {grade}")`,
    language: 'python',
    output: 'Score: 78\nGrade: A',
    submitted_at: '2026-02-12T09:15:00Z',
  },
  // Emma Wilson — Python Week 1 (submitted, graded)
  {
    id: 'sub-003',
    assignment_id: 'asg-py-w1',
    student_id: 'stu-002',
    code: `age = 21
gpa = 3.9
name = "Emma Wilson"
is_enrolled = True

print("Age:", age)
print("GPA:", gpa)
print("Name:", name)
print("Enrolled:", is_enrolled)`,
    language: 'python',
    output: 'Age: 21\nGPA: 3.9\nName: Emma Wilson\nEnrolled: True',
    submitted_at: '2026-02-05T18:45:00Z',
  },
  // Liam Johnson — Python Week 1 (submitted, graded)
  {
    id: 'sub-004',
    assignment_id: 'asg-py-w1',
    student_id: 'stu-003',
    code: `my_age = 22
my_gpa = 3.60
my_name = "Liam Johnson"
enrolled = True

print("Age:", my_age)
print("GPA:", my_gpa)
print("Name:", my_name)
print("Enrolled:", enrolled)`,
    language: 'python',
    output: 'Age: 22\nGPA: 3.6\nName: Liam Johnson\nEnrolled: True',
    submitted_at: '2026-02-06T22:10:00Z',
  },
  // Emma Wilson — Java Week 1 (submitted, graded)
  {
    id: 'sub-005',
    assignment_id: 'asg-java-w1',
    student_id: 'stu-002',
    code: `public class Student {
    String name;
    int age;
    double gpa;

    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }

    public String toString() {
        return "Student: " + name + ", Age: " + age + ", GPA: " + gpa;
    }

    public static void main(String[] args) {
        Student s1 = new Student("Alex Chen", 20, 3.75);
        Student s2 = new Student("Emma Wilson", 21, 3.90);
        System.out.println(s1);
        System.out.println(s2);
    }
}`,
    language: 'java',
    output: 'Student: Alex Chen, Age: 20, GPA: 3.75\nStudent: Emma Wilson, Age: 21, GPA: 3.9',
    submitted_at: '2026-02-06T11:20:00Z',
  },
  // William Miller — Python Week 1 (submitted, graded)
  {
    id: 'sub-006',
    assignment_id: 'asg-py-w1',
    student_id: 'stu-006',
    code: `age = 19
gpa = 3.2
name = "William Miller"
is_enrolled = True

print(f"Age: {age}")
print(f"GPA: {gpa}")
print(f"Name: {name}")
print(f"Enrolled: {is_enrolled}")`,
    language: 'python',
    output: 'Age: 19\nGPA: 3.2\nName: William Miller\nEnrolled: True',
    submitted_at: '2026-02-07T08:00:00Z',
  },
];
