import { Controller } from '@/application/controllers/controller'
import { HttpResponse } from '@/application/helpers/http'
import { ZodValidator } from '@/application/validation/zod-validator'
import { MockedSchema } from '@/tests/application/helpers/mock-schema'

jest.mock('@/application/validation/zod-validator')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

describe('FacebookLoginController', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('should return 400 validation fails', async () => {
    const error = new Error('validation_error')
    const ZodValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest.mocked(ZodValidator).mockImplementationOnce(ZodValidatorSpy)

    const httpRespose = await sut.handle('any_value', MockedSchema)

    expect(ZodValidator).toHaveBeenCalledTimes(1)
    expect(httpRespose).toEqual({
      statusCode: 400,
      data: error
    })
  })
})
